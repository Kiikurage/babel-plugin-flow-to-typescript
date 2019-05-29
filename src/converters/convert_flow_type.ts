import {NodePath} from '@babel/traverse';
import {
    booleanLiteral,
    FlowType,
    FunctionDeclaration,
    FunctionTypeAnnotation,
    FunctionTypeParam,
    GenericTypeAnnotation,
    Identifier,
    identifier,
    IntersectionTypeAnnotation,
    isAnyTypeAnnotation,
    isArrayTypeAnnotation,
    isBooleanLiteralTypeAnnotation,
    isBooleanTypeAnnotation,
    isEmptyTypeAnnotation,
    isExistsTypeAnnotation,
    isFlowType,
    isFunctionDeclaration,
    isFunctionTypeAnnotation,
    isGenericTypeAnnotation,
    isIdentifier,
    isIntersectionTypeAnnotation,
    isMixedTypeAnnotation,
    isNullableTypeAnnotation,
    isNullLiteralTypeAnnotation,
    isNumberLiteralTypeAnnotation,
    isNumberTypeAnnotation,
    isObjectTypeAnnotation,
    isObjectTypeProperty,
    isObjectTypeSpreadProperty,
    isStringLiteralTypeAnnotation,
    isStringTypeAnnotation,
    isThisTypeAnnotation,
    isTupleTypeAnnotation,
    isTypeAnnotation,
    isTypeofTypeAnnotation,
    isUnionTypeAnnotation,
    isVoidTypeAnnotation,
    NumberLiteralTypeAnnotation,
    numericLiteral,
    ObjectTypeAnnotation,
    ObjectTypeProperty,
    stringLiteral,
    StringLiteralTypeAnnotation,
    tsAnyKeyword,
    tsArrayType,
    tsBooleanKeyword,
    tsFunctionType,
    tsIndexedAccessType,
    tsIndexSignature,
    tsIntersectionType,
    tsLiteralType,
    tsNeverKeyword,
    tsNullKeyword,
    tsNumberKeyword,
    tsObjectKeyword,
    tsPropertySignature,
    tsStringKeyword,
    tsThisType,
    tsTupleType,
    TSType,
    tsTypeAnnotation,
    TSTypeElement,
    tsTypeLiteral,
    tsTypeOperator,
    TSTypeParameterInstantiation,
    tsTypeParameterInstantiation,
    tsTypeReference,
    tsUndefinedKeyword,
    tsUnionType,
    tsUnknownKeyword,
    tsVoidKeyword,
    TypeofTypeAnnotation,
    TupleTypeAnnotation,
    UnionTypeAnnotation,
} from '@babel/types';
import {
    isNodePath,
    UnsupportedError,
    warnOnlyOnce
} from '../util';
import {convertFlowIdentifier} from './convert_flow_identifier';

export function convertFlowType(path: NodePath<FlowType>): TSType {
    if (isNodePath(isAnyTypeAnnotation, path)) {
        return tsAnyKeyword();
    }

    if (isNodePath(isArrayTypeAnnotation, path)) {
        return tsArrayType(convertFlowType(path.get('elementType')));
    }

    if (isNodePath(isBooleanTypeAnnotation, path)) {
        return tsBooleanKeyword();
    }

    if (isNodePath(isBooleanLiteralTypeAnnotation, path)) {
        return tsLiteralType(booleanLiteral(path.node.value!));
    }

    if (isNodePath(isEmptyTypeAnnotation, path)) {
        return tsNeverKeyword();
    }

    if (isNodePath(isExistsTypeAnnotation, path)) {
        warnOnlyOnce('Existential type (*) in Flow is converted to "any" in TypeScript, and this conversion loses some type information.');
        return tsAnyKeyword();
    }

    if (isNodePath(isGenericTypeAnnotation, path)) {
        const typeParameterPath = path.get('typeParameters');
        let tsTypeParameters: TSTypeParameterInstantiation | null = null;
        if (typeParameterPath.node) {
            const tsParams = typeParameterPath.node.params.map((_, i) => convertFlowType(typeParameterPath.get(`params.${i}`)));
            tsTypeParameters = tsTypeParameterInstantiation(tsParams);
        }

        const id = (path as NodePath<GenericTypeAnnotation>).node.id;
        if (isIdentifier(id) && id.name === '$Keys') {
            // $Keys -> keyof
            const ret = tsTypeOperator(tsTypeParameters!.params[0]);
            ret.operator = 'keyof';
            return ret;

        } else if (isIdentifier(id) && id.name === '$Values') {
            // $Values<X> -> X[keyof X]
            const tsType = tsTypeParameters!.params[0];
            const tsKey = tsTypeOperator(tsType);
            tsKey.operator = 'keyof';
            return tsIndexedAccessType(tsType, tsKey);

        } else if (isIdentifier(id) && id.name === '$ReadOnly') {
            // $ReadOnly<X> -> Readonly<X>
            return tsTypeReference(identifier('Readonly'), tsTypeParameters);

        } else if (isIdentifier(id) && id.name === '$ReadOnlyArray') {
            // $ReadOnlyArray<X> -> ReadonlyArray<X>
            return tsTypeReference(identifier('ReadonlyArray'), tsTypeParameters);

        } else if (isIdentifier(id) && id.name === '$Exact') {
            warnOnlyOnce('Exact object type annotation in Flow is ignored. In TypeScript, it\'s always regarded as exact type');
            return tsTypeParameters!.params[0];

        } else if (isIdentifier(id) && id.name === '$Diff') {
            // $Diff<X, Y> -> Pick<X, Exclude<keyof X, keyof Y>>
            const [tsX, tsY] = tsTypeParameters!.params;
            const tsKeyofX = tsTypeOperator(tsX);
            const tsKeyofY = tsTypeOperator(tsY);
            tsKeyofX.operator = 'keyof';
            tsKeyofY.operator = 'keyof';
            const tsExclude = tsTypeReference(identifier('Exclude'), tsTypeParameterInstantiation([tsKeyofX, tsKeyofY]));
            return tsTypeReference(identifier('Pick'), tsTypeParameterInstantiation([tsX, tsExclude]));

        } else if (isIdentifier(id) && id.name === '$Rest') {
            throw new UnsupportedError('$Rest in GenericTypeAnnotation');

        } else if (isIdentifier(id) && id.name === '$PropertyType') {
            // $PropertyType<T, k> -> T[k]
            // TODO: $PropertyType<T, k> -> k extends string ? T[k] : never
            const [tsT, tsK] = tsTypeParameters!.params;
            return tsIndexedAccessType(tsT, tsK);

        } else if (isIdentifier(id) && id.name === '$ElementType') {
            // $ElementType<T, k> -> T[k]
            const [tsT, tsK] = tsTypeParameters!.params;
            return tsIndexedAccessType(tsT, tsK);

        } else if (isIdentifier(id) && id.name === '$FlowFixMe') {
            return tsTypeReference(identifier('any'), tsTypeParameters);

        } else if (isIdentifier(id) && id.name === 'Object') {
            return tsObjectKeyword();
        } else {
            return tsTypeReference(convertFlowIdentifier(id), tsTypeParameters);
        }
        //TODO: $ObjMap<T, F>, $TupleMap<T, F>, $Call<F>, Class<T>, $Supertype<T>, $Subtype<T>

    }

    if (isNodePath(isIntersectionTypeAnnotation, path)) {
        const flowTypes = (path as NodePath<IntersectionTypeAnnotation>).node.types;
        return tsIntersectionType(flowTypes.map((_, i) => convertFlowType((path as NodePath<IntersectionTypeAnnotation>).get(`types.${i}`) as NodePath<FlowType>)));
    }

    if (isNodePath(isMixedTypeAnnotation, path)) {
        return tsUnknownKeyword();
    }

    if (isNodePath(isNullableTypeAnnotation, path)) {
        const tsT = convertFlowType(path.get('typeAnnotation') as NodePath<FlowType>);

        // Note: for convenience, path stack is stacked in order that parent item is located before child one.
        const pathStack: NodePath[] = [path];
        while (isFlowType(pathStack[0].node) || isTypeAnnotation(pathStack[0].node) || isIdentifier(pathStack[0].node)) pathStack.unshift(pathStack[0].parentPath);

        if (isFunctionDeclaration(pathStack[0].node)) {
            if (pathStack[1].node === (pathStack[0].node as FunctionDeclaration).returnType) {
                // f(): ?T {} -> f(): T | null | undefined {}
                return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);

            } else {
                // Type annotation for function parameter
                const identifierPath = pathStack[1] as NodePath<Identifier>;
                if (identifierPath.node.optional) {
                    // ( arg?: ?T ) -> ( arg?: T | null )
                    return tsUnionType([tsT, tsNullKeyword()]);

                } else {
                    const argumentIndex = (pathStack[0].node as FunctionDeclaration).params.indexOf(identifierPath.node);

                    if ((pathStack[0].node as FunctionDeclaration).params.slice(argumentIndex).every(node => (node as Identifier).optional!)) {
                        // TODO:
                        // In Flow, required parameter which accepts undefined also accepts missing value,
                        // if the missing value is automatically filled with undefined.
                        // (= No required parameters are exist after the parameter).
                        //
                        // TypeScript doesn't allow missing value for parameter annotated with undefined.
                        // Therefore we need to modify the parameter as optional.
                        //
                        // f( arg: ?T ) -> f( arg?: T | null )
                        return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);

                    } else {
                        // Some required parameters are exist after this parameter.
                        // f( arg1: ?T, arg2: U ) -> f( arg1: T | null | undefined, arg2: U )
                        return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);
                    }
                }
            }
        }

        if (isObjectTypeProperty(pathStack[0].node)) {
            if ((pathStack[0].node as ObjectTypeProperty).optional) {
                // { key?: ?T } -> { key?: T | null }
                return tsUnionType([tsT, tsNullKeyword()]);

            } else {
                // { key: ?T } -> { key: T | null | undefined }
                return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);
            }
        }

        // var x: X<?T> -> var x: X<T | null | undefined>
        // var x:?T -> var x:T | null | undefined
        return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);
    }

    if (isNodePath(isNullLiteralTypeAnnotation, path)) {
        return tsNullKeyword();
    }

    if (isNodePath(isNumberLiteralTypeAnnotation, path)) {
        return tsLiteralType(numericLiteral((path as NodePath<NumberLiteralTypeAnnotation>).node.value!));
    }

    if (isNodePath(isNumberTypeAnnotation, path)) {
        return tsNumberKeyword();
    }

    if (isNodePath(isObjectTypeAnnotation, path)) {
        const members: TSTypeElement[] = [];
        const spreads: TSType[] = [];

        const objectTypeNode = path.node as ObjectTypeAnnotation;
        if (objectTypeNode.exact) {
            warnOnlyOnce('Exact object type annotation in Flow is ignored. In TypeScript, it\'s always regarded as exact type');
            objectTypeNode.exact = false;
        }

        if (objectTypeNode.properties && objectTypeNode.properties.length > 0) {
            for (const [i, property] of objectTypeNode.properties.entries()) {
                if (isObjectTypeProperty(property)) {
                    const tsPropSignature = tsPropertySignature(
                        property.key,
                        tsTypeAnnotation(convertFlowType(path.get(`properties.${i}`).get('value')))
                    );
                    tsPropSignature.optional = property.optional;
                    tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
                    members.push(tsPropSignature);
                }

                if (isObjectTypeSpreadProperty(property)) {
                    // {p1:T, ...U} -> {p1:T} | U
                    spreads.push(convertFlowType(path.get(`properties.${i}`).get('argument')));
                }
            }
        }

        if (objectTypeNode.indexers && objectTypeNode.indexers.length > 0) {
            for (const [i, indexer] of objectTypeNode.indexers.entries()) {
                const tsIndex = indexer.id || identifier('x');
                tsIndex.typeAnnotation = tsTypeAnnotation(convertFlowType(path.get(`indexers.${i}`).get('key') as NodePath<FlowType>));
                const member = tsIndexSignature([tsIndex], tsTypeAnnotation(convertFlowType(path.get(`indexers.${i}`).get('value') as NodePath<FlowType>)));
                members.push(member);
            }
        }

        if (objectTypeNode.callProperties && objectTypeNode.callProperties.length > 0) {
            throw new UnsupportedError('TSCallSignatureDeclaration');
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

        let ret: TSType = tsTypeLiteral(members);

        if (spreads.length > 0) {
            spreads.unshift(ret);
            ret = tsUnionType(spreads);
        }

        return ret;
    }

    if (isNodePath(isStringLiteralTypeAnnotation, path)) {
        return tsLiteralType(stringLiteral((path as NodePath<StringLiteralTypeAnnotation>).node.value!));
    }

    if (isNodePath(isStringTypeAnnotation, path)) {
        return tsStringKeyword();
    }

    if (isNodePath(isThisTypeAnnotation, path)) {
        return tsThisType();
    }

    if (isNodePath(isTypeofTypeAnnotation, path)) {
        const typeOp = tsTypeOperator(convertFlowType((path as NodePath<TypeofTypeAnnotation>).get('argument')));
        typeOp.operator = 'typeof';
        return typeOp;
    }

    if (isNodePath(isUnionTypeAnnotation, path)) {
        const flowTypes = (path as NodePath<UnionTypeAnnotation>).node.types;
        return tsUnionType(flowTypes.map((_, i) => convertFlowType((path as NodePath<UnionTypeAnnotation>).get(`types.${i}`))));
    }

    if (isNodePath(isVoidTypeAnnotation, path)) {
        return tsVoidKeyword();
    }

    if (isNodePath(isFunctionTypeAnnotation, path)) {
        const nodePath = path as NodePath<FunctionTypeAnnotation>;
        const identifiers = path.node.params.map((p, i) => {
            const name = (p.name && p.name.name) || `x${i}`;
            const ftParam = nodePath.get(`params.${i}`) as NodePath<FunctionTypeParam>;
            const typeAnn = ftParam.get('typeAnnotation') as NodePath<FlowType>;

            const iden = identifier(name);
            iden.typeAnnotation = tsTypeAnnotation(convertFlowType(typeAnn));
            return iden;
        });
        const returnType = tsTypeAnnotation(convertFlowType(nodePath.get('returnType')));
        const tsFT = tsFunctionType(null, [], returnType);
        tsFT.parameters = identifiers;
        return tsFT;
    }

    if (isNodePath(isTupleTypeAnnotation, path)) {
        const flowTypes = (path as NodePath<TupleTypeAnnotation>).node.types;
        return tsTupleType(flowTypes.map((_, i) => convertFlowType((path as NodePath<TupleTypeAnnotation>).get(`types.${i}`))));
    }

    throw new UnsupportedError(`FlowType(type=${path.node.type})`);
}
