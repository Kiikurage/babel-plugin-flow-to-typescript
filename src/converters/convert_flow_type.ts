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
  isStringLiteral,
  isStringLiteralTypeAnnotation,
  isStringTypeAnnotation,
  isThisTypeAnnotation,
  isTSFunctionType,
  isTSIndexSignature,
  isTSMethodSignature,
  isTSPropertySignature,
  isTSTypeLiteral,
  isTupleTypeAnnotation,
  isTypeofTypeAnnotation,
  isUnionTypeAnnotation,
  isVoidTypeAnnotation,
  numericLiteral,
  stringLiteral,
  tsAnyKeyword,
  tsArrayType,
  tsBooleanKeyword,
  tsFunctionType,
  tsIndexedAccessType,
  tsIntersectionType,
  tsLiteralType,
  tsNeverKeyword,
  tsNullKeyword,
  tsNumberKeyword,
  tsObjectKeyword,
  tsParenthesizedType,
  tsStringKeyword,
  tsThisType,
  tsTupleType,
  TSType,
  TSTypeElement,
  tsTypeLiteral,
  TSTypeOperator,
  tsTypeOperator,
  TSTypeParameterInstantiation,
  tsTypeParameterInstantiation,
  tsTypeReference,
  tsUndefinedKeyword,
  TSUnionType,
  tsUnionType,
  tsUnknownKeyword,
  tsVoidKeyword,
} from '@babel/types';
import { UnsupportedError, warnOnlyOnce } from '../util';
import { convertFlowIdentifier } from './convert_flow_identifier';
import { convertFunctionTypeAnnotation } from './convert_function_type_annotation';
import { convertObjectTypeCallProperty } from './convert_object_type_call_property';
import { convertObjectTypeIndexer } from './convert_object_type_indexer';
import { convertObjectTypeInternalSlot } from './convert_object_type_internal_slot';
import { baseNodeProps } from '../utils/baseNodeProps';
import { convertObjectTypeProperty } from './convert_object_type_property';

export function convertFlowType(node: FlowType): TSType {
  if (isAnyTypeAnnotation(node)) {
    return tsAnyKeyword();
  }

  if (isArrayTypeAnnotation(node)) {
    return tsArrayType({
      ...convertFlowType(node.elementType),
      ...baseNodeProps(node.elementType),
    });
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
      const tsParams = typeParameters.params.map(p => ({
        ...convertFlowType(p),
        ...baseNodeProps(p),
      }));
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
      // type $Diff<X, Y> = Omit<X, keyof y>;
      const [tsX, tsY] = tsTypeParameters!.params;

      let tsKeyofY: TSTypeOperator | TSUnionType = tsTypeOperator(tsY);
      tsKeyofY.operator = 'keyof';
      if (isTSTypeLiteral(tsY)) {
        const keys: string[] = [];
        let doable = true;
        tsY.members.forEach(m => {
          if (isTSPropertySignature(m) || isTSMethodSignature(m)) {
            if (isIdentifier(m.key)) {
              keys.push(m.key.name);
            } else if (isStringLiteral(m.key)) {
              keys.push(m.key.value);
            } else {
              doable = false;
            }
          } else if (isTSIndexSignature(m)) {
            doable = false;
          }
        });
        if (doable) {
          tsKeyofY = tsUnionType(keys.map(p => tsLiteralType(stringLiteral(p))));
        }
      }
      return tsTypeReference(identifier('Omit'), tsTypeParameterInstantiation([tsX, tsKeyofY]));
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
    } else if (isQualifiedTypeIdentifier(id) || isIdentifier(id)) {
      return tsTypeReference(convertFlowIdentifier(id), tsTypeParameters);
    }
    // for other utility types, helpers are added at top of file in Program visitor
  }

  if (isIntersectionTypeAnnotation(node)) {
    const flowTypes = node.types;
    return tsIntersectionType(
      flowTypes.map(v => {
        let tsType = convertFlowType(v);
        if (isTSFunctionType(tsType)) {
          tsType = tsParenthesizedType(tsType);
        }
        return { ...tsType, ...baseNodeProps(v) };
      }),
    );
  }

  if (isMixedTypeAnnotation(node)) {
    return tsUnknownKeyword();
  }

  if (isNullableTypeAnnotation(node)) {
    let tsType = convertFlowType(node.typeAnnotation);
    if (isTSFunctionType(tsType)) {
      tsType = tsParenthesizedType(tsType);
    }
    // f(): ?T {} -> f(): T | null | undefined {}
    // var x: X<?T> -> var x: X<T | null | undefined>
    // var x:?T -> var x:T | null | undefined
    return tsUnionType([tsType, tsUndefinedKeyword(), tsNullKeyword()]);
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

    if (node.exact) {
      warnOnlyOnce(
        "Exact object type annotation in Flow is ignored. In TypeScript, it's always regarded as exact type",
      );
      node.exact = false;
    }

    if (node.properties && node.properties.length > 0) {
      for (const property of node.properties) {
        if (isObjectTypeProperty(property)) {
          members.push({ ...convertObjectTypeProperty(property), ...baseNodeProps(property) });
        }

        if (isObjectTypeSpreadProperty(property)) {
          // {p1:T, ...U} -> {p1:T} & U
          spreads.push(convertFlowType(property.argument));
        }
      }
    }

    if (node.indexers && node.indexers.length > 0) {
      members.push(...node.indexers.map(convertObjectTypeIndexer));
    }

    if (node.callProperties) {
      members.push(...node.callProperties.map(convertObjectTypeCallProperty));
    }

    if (node.internalSlots) {
      members.push(...node.internalSlots.map(convertObjectTypeInternalSlot));
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
    return tsUnionType(
      flowTypes.map(v => {
        let tsType = convertFlowType(v);
        if (isTSFunctionType(tsType)) {
          tsType = tsParenthesizedType(tsType);
        }
        return { ...tsType, ...baseNodeProps(v) };
      }),
    );
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
