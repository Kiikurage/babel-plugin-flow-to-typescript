import {
  FunctionTypeAnnotation,
  identifier,
  Identifier,
  isNullableTypeAnnotation,
  restElement,
  RestElement,
  tsNullKeyword,
  TSType,
  tsTypeAnnotation,
  TSTypeAnnotation,
  tsUnionType,
} from '@babel/types';
import { generateFreeIdentifier } from '../util';
import { convertFlowType } from './convert_flow_type';
import { convertTypeParameterDeclaration } from './convert_type_parameter_declaration';
import { baseNodeProps } from '../utils/baseNodeProps';

export function convertFunctionTypeAnnotation(node: FunctionTypeAnnotation) {
  // https://github.com/bcherny/flow-to-typescript/blob/f1dbe3d1f97b97d655ea6c5f1f5caaaa9f1e0c9f/src/convert.ts
  let typeParams = undefined;

  if (node.typeParameters !== null) {
    typeParams = {
      ...convertTypeParameterDeclaration(node.typeParameters),
      ...baseNodeProps(node.typeParameters),
    };
  }

  let parameters: Array<Identifier | RestElement> = [];
  let returnType: TSTypeAnnotation | null = null;

  // Params
  if (node.params) {
    const paramNames = node.params
      .map(_ => _.name)
      .filter(_ => _ !== null)
      .map(_ => (_ as Identifier).name);
    parameters = node.params.map(param => {
      let name = param.name && param.name.name;

      // Generate param name? (Required in TS, optional in Flow)
      if (name == null) {
        // todo: generate it from type?
        name = generateFreeIdentifier(paramNames);
        paramNames.push(name);
      }

      const id = identifier(name);
      id.optional = param.optional;
      if (param.typeAnnotation) {
        let typeAnnotation: TSType;
        if (isNullableTypeAnnotation(param.typeAnnotation)) {
          if (param.optional) {
            typeAnnotation = tsUnionType([
              convertFlowType(param.typeAnnotation.typeAnnotation),
              tsNullKeyword(),
            ]);
          } else {
            // todo: is optional because nullable and no required arguments after it
            //
            //     const argumentIndex = (pathStack[0].node as FunctionDeclaration).params.indexOf(
            //       identifierPath.node,
            //     );
            //
            //     if (
            //       (pathStack[0].node as FunctionDeclaration).params
            //         .slice(argumentIndex)
            //         .every(node => (node as Identifier).optional!)
            //     ) {
            //       // TODO:
            //       // In Flow, required parameter which accepts undefined also accepts missing value,
            //       // if the missing value is automatically filled with undefined.
            //       // (= No required parameters are exist after the parameter).
            //       //
            //       // TypeScript doesn't allow missing value for parameter annotated with undefined.
            //       // Therefore we need to modify the parameter as optional.
            //       //
            //       // f( arg: ?T ) -> f( arg?: T | null )
            //       return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);
            //     } else {
            //       // Some required parameters are exist after this parameter.
            //       // f( arg1: ?T, arg2: U ) -> f( arg1: T | null | undefined, arg2: U )
            //       return tsUnionType([tsT, tsUndefinedKeyword(), tsNullKeyword()]);
            //     }
            typeAnnotation = convertFlowType(param.typeAnnotation);
          }
        } else {
          typeAnnotation = convertFlowType(param.typeAnnotation);
        }
        id.typeAnnotation = {
          ...tsTypeAnnotation(typeAnnotation),
          ...baseNodeProps(param.typeAnnotation),
        };
      }

      return { ...id, ...baseNodeProps(param) };
    });
  }

  // rest parameters
  if (node.rest) {
    if (node.rest.name) {
      const id = restElement(node.rest.name);
      id.typeAnnotation = tsTypeAnnotation(convertFlowType(node.rest.typeAnnotation));
      parameters.push({ ...id, ...baseNodeProps(node.rest) });
    }
  }

  // Return type
  if (node.returnType) {
    returnType = tsTypeAnnotation({
      ...convertFlowType(node.returnType),
      ...baseNodeProps(node.returnType),
    });
  }
  return { typeParams, parameters, returnType };
}
