// tslint:disable:no-any
import {
  Identifier,
  DeclareClass,
  ClassMethod,
  ClassDeclaration,
  classDeclaration,
  classBody,
  classProperty,
  tsDeclareMethod,
  tsTypeAnnotation,
  tsParenthesizedType,
  isTSFunctionType,
  TSType,
  isObjectTypeSpreadProperty,
  isTypeParameter,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { warnOnlyOnce } from '../util';
import { convertFlowType } from '../converters/convert_flow_type';
import { convertTypeParameter } from '../converters/convert_type_parameter';
import { convertInterfaceExtends } from '../converters/convert_interface_declaration';

const SYM_MADE_INTERNALLY = Symbol('Class Made Interanally by flow-to-ts');

export function ClassMethod(path: NodePath<ClassMethod>) {
  if (path.node.kind === 'constructor') {
    path.get('returnType').remove();
  }
}

function processTypeParameters(typeParameter: any) {
  typeParameter.params = typeParameter.params.map((p: any) => {
    if (isTypeParameter(p)) {
      return convertTypeParameter(p);
    } else {
      return convertFlowType(p);
    }
  });
}

export function ClassDeclaration(
  path: NodePath<ClassDeclaration & { [SYM_MADE_INTERNALLY]?: boolean }>,
) {
  const node = path.node;
  if (node[SYM_MADE_INTERNALLY]) {
    return;
  }

  const superTypeParametersPath = node.superTypeParameters;
  if (superTypeParametersPath) {
    processTypeParameters(superTypeParametersPath);
  }

  const typeParameterPath = node.typeParameters;
  if (typeParameterPath) {
    processTypeParameters(typeParameterPath);
  }

  const classImplements = node.implements;
  if (Array.isArray(classImplements)) {
    classImplements.forEach(classImplementsPath => {
      const typeParameterPath = classImplementsPath.typeParameters;
      if (typeParameterPath) {
        processTypeParameters(typeParameterPath);
      }
    });
  }
}

export function DeclareClass(path: NodePath<DeclareClass>) {
  const node = path.node;
  const typeParameterPath = node.typeParameters;
  const extendsPath = node.extends;
  const propertiesPaths = node.body.properties;

  const classProperties: any = [];

  propertiesPaths.forEach(propertyPath => {
    const property = propertyPath;

    if (isObjectTypeSpreadProperty(property)) {
      // todo:
      return;
    }

    let convertedProperty: TSType;
    convertedProperty = convertFlowType(property.value);
    if (isTSFunctionType(convertedProperty)) {
      convertedProperty = tsParenthesizedType(convertedProperty);
    }
    if ((property as any).method) {
      const converted = tsDeclareMethod(
        null,
        property.key,
        null,
        (convertedProperty as any).typeAnnotation.parameters,
        (convertedProperty as any).typeAnnotation.typeAnnotation,
      );

      converted.static = property.static;
      // @ts-ignore
      converted.kind = property.kind;
      classProperties.push(converted);
    } else if ((property as any).kind === 'init') {
      const converted = classProperty(property.key, null, tsTypeAnnotation(convertedProperty));
      converted.static = property.static;
      classProperties.push(converted);
    }
  });

  const decl = classDeclaration(path.node.id, null, classBody(classProperties), []);
  // @ts-ignore
  decl[SYM_MADE_INTERNALLY] = true;

  decl.declare = true;
  if (typeParameterPath) {
    processTypeParameters(typeParameterPath);
    decl.typeParameters = typeParameterPath;
  }

  if (extendsPath && extendsPath.length) {
    if (extendsPath.length > 1) {
      warnOnlyOnce(
        'declare-class-many-parents',
        'Declare Class definitions in TS can only have one super class. Dropping extras.',
      );
    }

    const firstExtend = convertInterfaceExtends(extendsPath[0]);
    decl.superClass = firstExtend.expression as Identifier;
    decl.superTypeParameters = firstExtend.typeParameters;
  }
  path.replaceWith(decl);
}
