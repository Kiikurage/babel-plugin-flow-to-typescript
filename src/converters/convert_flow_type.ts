import {
  booleanLiteral,
  FlowType,
  identifier,
  isAnyTypeAnnotation,
  isArrayTypeAnnotation,
  isBooleanLiteralTypeAnnotation,
  isBooleanTypeAnnotation,
  isEmptyTypeAnnotation,
  isExistsTypeAnnotation,
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
  isQualifiedTypeIdentifier,
  isStringLiteralTypeAnnotation,
  isStringTypeAnnotation,
  isThisTypeAnnotation,
  isTupleTypeAnnotation,
  isTypeofTypeAnnotation,
  isUnionTypeAnnotation,
  isVoidTypeAnnotation,
  numericLiteral,
  ObjectTypeAnnotation,
  stringLiteral,
  tsAnyKeyword,
  tsArrayType,
  tsBooleanKeyword,
  tsCallSignatureDeclaration,
  TSEntityName,
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
  tsQualifiedName,
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
} from '@babel/types';
import { UnsupportedError, warnOnlyOnce } from '../util';
import { convertFlowIdentifier } from './convert_flow_identifier';
import { convertFunctionTypeAnnotation } from './convert_function_type_annotation';

export function convertFlowType(node: FlowType): TSType {
  if (isAnyTypeAnnotation(node)) {
    return tsAnyKeyword();
  }

  if (isArrayTypeAnnotation(node)) {
    return tsArrayType(convertFlowType(node.elementType));
  }

  if (isBooleanTypeAnnotation(node)) {
    return tsBooleanKeyword();
  }

  if (isBooleanLiteralTypeAnnotation(node)) {
    return tsLiteralType(booleanLiteral(node.value));
  }

  if (isEmptyTypeAnnotation(node)) {
    return tsNeverKeyword();
  }

  if (isExistsTypeAnnotation(node)) {
    warnOnlyOnce(
      'Existential type (*) in Flow is converted to "any" in TypeScript, and this conversion loses some type information.',
    );
    return tsAnyKeyword();
  }

  if (isGenericTypeAnnotation(node)) {
    const typeParameters = node.typeParameters;
    let tsTypeParameters: TSTypeParameterInstantiation | null = null;
    if (typeParameters) {
      const tsParams = typeParameters.params.map(convertFlowType);
      tsTypeParameters = tsTypeParameterInstantiation(tsParams);
    }

    const id = node.id;
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
      warnOnlyOnce(
        "Exact object type annotation in Flow is ignored. In TypeScript, it's always regarded as exact type",
      );
      return tsTypeParameters!.params[0];
    } else if (isIdentifier(id) && id.name === '$Diff') {
      // $Diff<X, Y> -> Pick<X, Exclude<keyof X, keyof Y>>
      const [tsX, tsY] = tsTypeParameters!.params;
      const tsKeyofX = tsTypeOperator(tsX);
      const tsKeyofY = tsTypeOperator(tsY);
      tsKeyofX.operator = 'keyof';
      tsKeyofY.operator = 'keyof';
      const tsExclude = tsTypeReference(
        identifier('Exclude'),
        tsTypeParameterInstantiation([tsKeyofX, tsKeyofY]),
      );
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
    } else if (isIdentifier(id) && id.name === '$Shape') {
      // $Shape<T> -> Partial<T>
      return tsTypeReference(identifier('Partial'), tsTypeParameters);
    } else if (isIdentifier(id) && id.name === 'Class') {
      // Class<T> -> typeof T
      const tsType = tsTypeParameters!.params[0];
      const tsTypeofT = tsTypeOperator(tsType);
      tsTypeofT.operator = 'typeof';
      return tsTypeofT;
    } else if (isIdentifier(id) && id.name === '$FlowFixMe') {
      return tsTypeReference(identifier('any'), tsTypeParameters);
    } else if (isIdentifier(id) && id.name === 'Object') {
      return tsObjectKeyword();
    } else if (isQualifiedTypeIdentifier(id)) {
      if (isIdentifier(id.qualification)) {
        return tsTypeReference(
          identifier(`${id.qualification.name}.${id.id.name}`),
          tsTypeParameters,
        );
      } else {
        // todo:
        throw new Error('Not implemented');
      }
    } else if (isQualifiedTypeIdentifier(id)) {
      // todo:
      if (isQualifiedTypeIdentifier(id.qualification)) {
        // todo: move buildCodeFrameError thingy outside
        // throw path.buildCodeFrameError('Nested qualification is not supported', UnsupportedError);
      }
      const tsQ = tsQualifiedName(id.qualification as TSEntityName, id.id);
      return tsTypeReference(tsQ, tsTypeParameters);
    } else {
      return tsTypeReference(convertFlowIdentifier(id), tsTypeParameters);
    }
    //TODO: $ObjMap<T, F>, $TupleMap<T, F>, $Call<F>, $Supertype<T>, $Subtype<T>
  }

  if (isIntersectionTypeAnnotation(node)) {
    const flowTypes = node.types;
    return tsIntersectionType(flowTypes.map(convertFlowType));
  }

  if (isMixedTypeAnnotation(node)) {
    return tsUnknownKeyword();
  }

  if (isNullableTypeAnnotation(node)) {
    const tsT = convertFlowType(node.typeAnnotation);
    // f(): ?T {} -> f(): T | null | undefined {}
    // var x: X<?T> -> var x: X<T | null | undefined>
    // var x:?T -> var x:T | null | undefined
    return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);
  }

  if (isNullLiteralTypeAnnotation(node)) {
    return tsNullKeyword();
  }

  if (isNumberLiteralTypeAnnotation(node)) {
    return tsLiteralType(numericLiteral(node.value));
  }

  if (isNumberTypeAnnotation(node)) {
    return tsNumberKeyword();
  }

  if (isObjectTypeAnnotation(node)) {
    const members: TSTypeElement[] = [];
    const spreads: TSType[] = [];

    // todo: useless typecast
    const objectTypeNode = node as ObjectTypeAnnotation;
    if (objectTypeNode.exact) {
      warnOnlyOnce(
        "Exact object type annotation in Flow is ignored. In TypeScript, it's always regarded as exact type",
      );
      objectTypeNode.exact = false;
    }

    if (objectTypeNode.properties && objectTypeNode.properties.length > 0) {
      for (const property of objectTypeNode.properties) {
        if (isObjectTypeProperty(property)) {
          let tsT: TSType;
          if (!isNullableTypeAnnotation(property.value)) {
            tsT = convertFlowType(property.value);
          } else {
            const tsValueT = convertFlowType(property.value.typeAnnotation);
            if (property.optional) {
              // { key?: ?T } -> { key?: T | null }
              tsT = tsUnionType([tsValueT, tsNullKeyword()]);
            } else {
              // { key: ?T } -> { key: T | null | undefined }
              tsT = tsUnionType([tsValueT, tsUndefinedKeyword(), tsNullKeyword()]);
            }
          }

          const tsPropSignature = tsPropertySignature(property.key, tsTypeAnnotation(tsT));
          tsPropSignature.optional = property.optional;
          tsPropSignature.readonly = property.variance && property.variance.kind === 'plus';
          tsPropSignature.innerComments = property.innerComments;
          tsPropSignature.leadingComments = property.leadingComments;
          tsPropSignature.trailingComments = property.trailingComments;
          members.push(tsPropSignature);
        }

        if (isObjectTypeSpreadProperty(property)) {
          // {p1:T, ...U} -> {p1:T} | U
          spreads.push(convertFlowType(property.argument));
        }
      }
    }

    if (objectTypeNode.indexers && objectTypeNode.indexers.length > 0) {
      for (const indexer of objectTypeNode.indexers) {
        const tsIndex = indexer.id || identifier('x');
        tsIndex.typeAnnotation = tsTypeAnnotation(convertFlowType(indexer.key));
        const member = tsIndexSignature(
          [tsIndex],
          tsTypeAnnotation(convertFlowType(indexer.value)),
        );
        members.push(member);
      }
    }

    if (objectTypeNode.callProperties && objectTypeNode.callProperties.length > 0) {
      members.push(
        ...objectTypeNode.callProperties.map(callPropperty => {
          if (isFunctionTypeAnnotation(callPropperty.value)) {
            const { typeParams, parameters, returnType } = convertFunctionTypeAnnotation(
              callPropperty.value,
            );

            return tsCallSignatureDeclaration(typeParams, parameters, returnType);
          } else {
            throw new Error('ObjectCallTypeProperty case not implemented');
          }
        }),
      );
    }

    // TSCallSignatureDeclaration | TSConstructSignatureDeclaration | TSMethodSignature ;

    let ret: TSType = tsTypeLiteral(members);

    if (spreads.length > 0) {
      spreads.unshift(ret);
      ret = tsIntersectionType(spreads);
    }

    return ret;
  }

  if (isStringLiteralTypeAnnotation(node)) {
    return tsLiteralType(stringLiteral(node.value!));
  }

  if (isStringTypeAnnotation(node)) {
    return tsStringKeyword();
  }

  if (isThisTypeAnnotation(node)) {
    return tsThisType();
  }

  if (isTypeofTypeAnnotation(node)) {
    const typeOp = tsTypeOperator(convertFlowType(node.argument));
    typeOp.operator = 'typeof';
    return typeOp;
  }

  if (isUnionTypeAnnotation(node)) {
    const flowTypes = node.types;
    return tsUnionType(flowTypes.map(_ => convertFlowType(_)));
  }

  if (isVoidTypeAnnotation(node)) {
    return tsVoidKeyword();
  }

  if (isFunctionTypeAnnotation(node)) {
    const { typeParams, parameters, returnType } = convertFunctionTypeAnnotation(node);
    return tsFunctionType(typeParams, parameters, returnType);
  }

  if (isTupleTypeAnnotation(node)) {
    const flowTypes = node.types;
    return tsTupleType(flowTypes.map(convertFlowType));
  }

  throw new UnsupportedError(`FlowType(type=${node.type})`);
}
