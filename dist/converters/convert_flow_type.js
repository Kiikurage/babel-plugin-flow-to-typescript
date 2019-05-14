"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("@babel/types");
const util_1 = require("../util");
function convertFlowType(path) {
    if (util_1.isNodePath(types_1.isAnyTypeAnnotation, path)) {
        return types_1.tsAnyKeyword();
    }
    if (util_1.isNodePath(types_1.isArrayTypeAnnotation, path)) {
        return types_1.tsArrayType(convertFlowType(path.get('elementType')));
    }
    if (util_1.isNodePath(types_1.isBooleanTypeAnnotation, path)) {
        return types_1.tsBooleanKeyword();
    }
    if (util_1.isNodePath(types_1.isBooleanLiteralTypeAnnotation, path)) {
        return types_1.tsLiteralType(types_1.booleanLiteral(path.node.value));
    }
    if (util_1.isNodePath(types_1.isEmptyTypeAnnotation, path)) {
        return types_1.tsNeverKeyword();
    }
    if (util_1.isNodePath(types_1.isExistsTypeAnnotation, path)) {
        util_1.warnOnlyOnce('Existential type (*) in Flow is converted to "any" in TypeScript, and this conversion loses some type information.');
        return types_1.tsAnyKeyword();
    }
    if (util_1.isNodePath(types_1.isGenericTypeAnnotation, path)) {
        const typeParameterPath = path.get('typeParameters');
        let tsTypeParameters = null;
        if (typeParameterPath.node) {
            const tsParams = typeParameterPath.node.params.map((_, i) => convertFlowType(typeParameterPath.get(`params.${i}`)));
            tsTypeParameters = types_1.tsTypeParameterInstantiation(tsParams);
        }
        const id = path.node.id;
        if (id.name === '$Keys') {
            // $Keys -> keyof
            const ret = types_1.tsTypeOperator(tsTypeParameters.params[0]);
            ret.operator = 'keyof';
            return ret;
        }
        else if (id.name === '$Values') {
            // $Values<X> -> X[keyof X]
            const tsType = tsTypeParameters.params[0];
            const tsKey = types_1.tsTypeOperator(tsType);
            tsKey.operator = 'keyof';
            return types_1.tsIndexedAccessType(tsType, tsKey);
        }
        else if (id.name === '$ReadOnly') {
            // $ReadOnly<X> -> Readonly<X>
            return types_1.tsTypeReference(types_1.identifier('Readonly'), tsTypeParameters);
        }
        else if (id.name === '$ReadOnlyArray') {
            // $ReadOnlyArray<X> -> ReadonlyArray<X>
            return types_1.tsTypeReference(types_1.identifier('ReadonlyArray'), tsTypeParameters);
        }
        else if (id.name === '$Exact') {
            util_1.warnOnlyOnce("Exact object type annotation in Flow is ignored. In TypeScript, it's always regarded as exact type");
            return tsTypeParameters.params[0];
        }
        else if (id.name === '$Diff') {
            // $Diff<X, Y> -> Pick<X, Exclude<keyof X, keyof Y>>
            const [tsX, tsY] = tsTypeParameters.params;
            const tsKeyofX = types_1.tsTypeOperator(tsX);
            const tsKeyofY = types_1.tsTypeOperator(tsY);
            tsKeyofX.operator = 'keyof';
            tsKeyofY.operator = 'keyof';
            const tsExclude = types_1.tsTypeReference(types_1.identifier('Exclude'), types_1.tsTypeParameterInstantiation([tsKeyofX, tsKeyofY]));
            return types_1.tsTypeReference(types_1.identifier('Pick'), types_1.tsTypeParameterInstantiation([tsX, tsExclude]));
        }
        else if (id.name === '$Rest') {
            throw new util_1.UnsupportedError('$Rest in GenericTypeAnnotation');
        }
        else if (id.name === '$PropertyType') {
            // $PropertyType<T, k> -> T[k]
            // TODO: $PropertyType<T, k> -> k extends string ? T[k] : never
            const [tsT, tsK] = tsTypeParameters.params;
            return types_1.tsIndexedAccessType(tsT, tsK);
        }
        else if (id.name === '$ElementType') {
            // $ElementType<T, k> -> T[k]
            const [tsT, tsK] = tsTypeParameters.params;
            return types_1.tsIndexedAccessType(tsT, tsK);
        }
        else if (id.name === '$FlowFixMe') {
            return types_1.tsTypeReference(types_1.identifier('any'), tsTypeParameters);
        }
        else if (id.name === 'Object') {
            return types_1.tsAnyKeyword();
            // @ts-ignore
        }
        else if (id.type === 'QualifiedTypeIdentifier') {
            // @ts-ignore
            return types_1.tsTypeReference(
            // @ts-ignore
            types_1.identifier(`${id.qualification.name}.${id.id.name}`), tsTypeParameters);
        }
        else {
            return types_1.tsTypeReference(id, tsTypeParameters);
        }
        //TODO: $ObjMap<T, F>, $TupleMap<T, F>, $Call<F>, Class<T>, $Supertype<T>, $Subtype<T>
    }
    if (util_1.isNodePath(types_1.isIntersectionTypeAnnotation, path)) {
        const flowTypes = path.node.types;
        return types_1.tsIntersectionType(flowTypes.map((_, i) => convertFlowType(path.get(`types.${i}`))));
    }
    if (util_1.isNodePath(types_1.isMixedTypeAnnotation, path)) {
        return types_1.tsAnyKeyword();
    }
    if (util_1.isNodePath(types_1.isNullableTypeAnnotation, path)) {
        const tsT = convertFlowType(path.get('typeAnnotation'));
        // Note: for convenience, path stack is stacked in order that parent item is located before child one.
        const pathStack = [path];
        while (types_1.isFlowType(pathStack[0].node) || types_1.isTypeAnnotation(pathStack[0].node) || types_1.isIdentifier(pathStack[0].node))
            pathStack.unshift(pathStack[0].parentPath);
        if (types_1.isFunctionDeclaration(pathStack[0].node)) {
            if (pathStack[1].node === pathStack[0].node.returnType) {
                // f(): ?T {} -> f(): T | null | undefined {}
                return types_1.tsUnionType([tsT, types_1.tsUndefinedKeyword(), types_1.tsNullKeyword()]);
            }
            else {
                // Type annotation for function parameter
                const identifierPath = pathStack[1];
                if (identifierPath.node.optional) {
                    // ( arg?: ?T ) -> ( arg?: T | null )
                    return types_1.tsUnionType([tsT, types_1.tsNullKeyword()]);
                }
                else {
                    const argumentIndex = pathStack[0].node.params.indexOf(identifierPath.node);
                    if (pathStack[0].node.params.slice(argumentIndex).every(node => node.optional)) {
                        // TODO:
                        // In Flow, required parameter which accepts undefined also accepts missing value,
                        // if the missing value is automatically filled with undefined.
                        // (= No required parameters are exist after the parameter).
                        //
                        // TypeScript doesn't allow missing value for parameter annotated with undefined.
                        // Therefore we need to modify the parameter as optional.
                        //
                        // f( arg: ?T ) -> f( arg?: T | null )
                        return types_1.tsUnionType([tsT, types_1.tsUndefinedKeyword(), types_1.tsNullKeyword()]);
                    }
                    else {
                        // Some required parameters are exist after this parameter.
                        // f( arg1: ?T, arg2: U ) -> f( arg1: T | null | undefined, arg2: U )
                        return types_1.tsUnionType([tsT, types_1.tsUndefinedKeyword(), types_1.tsNullKeyword()]);
                    }
                }
            }
        }
        if (types_1.isObjectTypeProperty(pathStack[0].node)) {
            if (pathStack[0].node.optional) {
                // { key?: ?T } -> { key?: T | null }
                return types_1.tsUnionType([tsT, types_1.tsNullKeyword()]);
            }
            else {
                // { key: ?T } -> { key: T | null | undefined }
                return types_1.tsUnionType([tsT, types_1.tsUndefinedKeyword(), types_1.tsNullKeyword()]);
            }
        }
        // var x: X<?T> -> var x: X<T | null | undefined>
        // var x:?T -> var x:T | null | undefined
        return types_1.tsUnionType([tsT, types_1.tsUndefinedKeyword(), types_1.tsNullKeyword()]);
    }
    if (util_1.isNodePath(types_1.isNullLiteralTypeAnnotation, path)) {
        return types_1.tsNullKeyword();
    }
    if (util_1.isNodePath(types_1.isNumberLiteralTypeAnnotation, path)) {
        return types_1.tsLiteralType(types_1.numericLiteral(path.node.value));
    }
    if (util_1.isNodePath(types_1.isNumberTypeAnnotation, path)) {
        return types_1.tsNumberKeyword();
    }
    if (util_1.isNodePath(types_1.isObjectTypeAnnotation, path)) {
        const members = [];
        const spreads = [];
        const objectTypeNode = path.node;
        if (objectTypeNode.exact) {
            util_1.warnOnlyOnce("Exact object type annotation in Flow is ignored. In TypeScript, it's always regarded as exact type");
            objectTypeNode.exact = false;
        }
        if (objectTypeNode.properties && objectTypeNode.properties.length > 0) {
            for (const [i, property] of objectTypeNode.properties.entries()) {
                if (types_1.isObjectTypeProperty(property)) {
                    const tsPropSignature = types_1.tsPropertySignature(property.key, types_1.tsTypeAnnotation(convertFlowType(path.get(`properties.${i}`).get('value'))));
                    tsPropSignature.optional = property.optional;
                    tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
                    // @ts-ignore
                    tsPropSignature.comments = property.comments;
                    members.push(tsPropSignature);
                }
                if (types_1.isObjectTypeSpreadProperty(property)) {
                    // {p1:T, ...U} -> {p1:T} | U
                    spreads.push(convertFlowType(path.get(`properties.${i}`).get('argument')));
                }
            }
        }
        if (objectTypeNode.indexers && objectTypeNode.indexers.length > 0) {
            for (const [i, indexer] of objectTypeNode.indexers.entries()) {
                const tsIndex = indexer.id || types_1.identifier('x');
                tsIndex.typeAnnotation = types_1.tsTypeAnnotation(convertFlowType(path.get(`indexers.${i}`).get('key')));
                const member = types_1.tsIndexSignature([tsIndex], types_1.tsTypeAnnotation(convertFlowType(path.get(`indexers.${i}`).get('value'))));
                members.push(member);
            }
        }
        if (objectTypeNode.callProperties && objectTypeNode.callProperties.length > 0) {
            throw new util_1.UnsupportedError('TSCallSignatureDeclaration');
            // TODO
            // for (const [i, callProperty] of objectTypeNode.callProperties.entries()) {
            //     //parameters: Array<Identifier>, typeAnnotation?: TSTypeAnnotation | null, readonly?: boolean | null
            //     const tsIndex = indexer.id || identifier('x');
            //     tsIndex.typeAnnotation = tsTypeAnnotation(convertFlowType(path.get(`indexers.${i}`).get('key') as NodePath<FlowType>));
            //     const member = tsCallSignatureDeclaration([tsIndex], tsTypeAnnotation(convertFlowType(path.get(`indexers.${i}`).get('value') as NodePath<FlowType>)));
            //     members.push(member);
            // }
        }
        // TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSMethodSignature ;
        let ret = types_1.tsTypeLiteral(members);
        if (spreads.length > 0) {
            spreads.unshift(ret);
            ret = types_1.tsUnionType(spreads);
        }
        return ret;
    }
    if (util_1.isNodePath(types_1.isStringLiteralTypeAnnotation, path)) {
        return types_1.tsLiteralType(types_1.stringLiteral(path.node.value));
    }
    if (util_1.isNodePath(types_1.isStringTypeAnnotation, path)) {
        return types_1.tsStringKeyword();
    }
    if (util_1.isNodePath(types_1.isThisTypeAnnotation, path)) {
        return types_1.tsThisType();
    }
    if (util_1.isNodePath(types_1.isTypeofTypeAnnotation, path)) {
        const typeOp = types_1.tsTypeOperator(convertFlowType(path.get('argument')));
        typeOp.operator = 'typeof';
        return typeOp;
    }
    if (util_1.isNodePath(types_1.isUnionTypeAnnotation, path)) {
        const flowTypes = path.node.types;
        return types_1.tsUnionType(flowTypes.map((_, i) => convertFlowType(path.get(`types.${i}`))));
    }
    if (util_1.isNodePath(types_1.isVoidTypeAnnotation, path)) {
        return types_1.tsVoidKeyword();
    }
    if (util_1.isNodePath(types_1.isFunctionTypeAnnotation, path)) {
        const nodePath = path;
        const identifiers = path.node.params.map((p, i) => {
            const name = (p.name && p.name.name) || `x${i}`;
            const ftParam = nodePath.get(`params.${i}`);
            const typeAnn = ftParam.get('typeAnnotation');
            const iden = types_1.identifier(name);
            iden.typeAnnotation = types_1.tsTypeAnnotation(convertFlowType(typeAnn));
            return iden;
        });
        const returnType = types_1.tsTypeAnnotation(convertFlowType(nodePath.get('returnType')));
        const tsFT = types_1.tsFunctionType(null, returnType);
        tsFT.parameters = identifiers;
        return tsFT;
    }
    if (util_1.isNodePath(types_1.isTupleTypeAnnotation, path)) {
        const flowTypes = path.node.types;
        return types_1.tsTupleType(flowTypes.map((_, i) => convertFlowType(path.get(`types.${i}`))));
    }
    throw new util_1.UnsupportedError(`FlowType(type=${path.node.type})`);
}
exports.convertFlowType = convertFlowType;
//# sourceMappingURL=convert_flow_type.js.map