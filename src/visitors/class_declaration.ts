// tslint:disable:no-any
import {
  Identifier,
  DeclareClass,
  ClassMethod,
  ClassDeclaration,
  ObjectTypeProperty,
  classDeclaration,
  classBody,
  classProperty,
  tsDeclareMethod,
  tsTypeAnnotation,
  tsParenthesizedType,
  isTSFunctionType,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { warnOnlyOnce } from '../util';
import { convertFlowType } from '../converters/convert_flow_type';
import { convertTypeParameter } from '../converters/convert_type_parameter';
import { convertClassConstructor } from '../converters/convert_class_constructor';
import { convertInterfaceExtends } from '../converters/convert_interface_declaration';

const SYM_MADE_INTERNALLY = Symbol('Class Made Interanally by flow-to-ts');

export function ClassMethod(path: NodePath<ClassMethod>) {
  if (path.node.kind === 'constructor') {
    path.replaceWith(convertClassConstructor(path));
  }
}

function processTypeParameters(typeParameterPath: any) {
  typeParameterPath.node.params = typeParameterPath.node.params.map((_: any, i: number) => {
    const paramPath = typeParameterPath.get(`params.${i}`);
    if (paramPath.isTypeParameter()) {
      return convertTypeParameter(paramPath);
    } else {
      return convertFlowType(paramPath);
    }
  });
}

export function ClassDeclaration(path: NodePath<ClassDeclaration>) {
  // @ts-ignore
  if (path.node[SYM_MADE_INTERNALLY]) {
    return;
  }

  const superTypeParametersPath = path.get('superTypeParameters');
  if (superTypeParametersPath.node) {
    processTypeParameters(superTypeParametersPath);
  }

  const typeParameterPath = path.get('typeParameters');
  if (typeParameterPath.node) {
    processTypeParameters(typeParameterPath);
  }

  const classImplements = path.get('implements');
  if (Array.isArray(classImplements)) {
    // @ts-ignore
    classImplements.forEach(classImplementsPath => {
      const typeParameterPath = classImplementsPath.get('typeParameters');
      if (typeParameterPath.node) {
        processTypeParameters(typeParameterPath);
      }
    });
  }
}

export function DeclareClass(path: NodePath<DeclareClass>) {
  const typeParameterPath = path.get('typeParameters');
  const extendsPath = path.get('extends');
  const propertiesPaths = path.get('body.properties') as NodePath<ObjectTypeProperty>[];

  const classProperties: any = [];

  propertiesPaths.forEach(propertyPath => {
    const property = propertyPath.node;

    let convertedProperty: any;
    convertedProperty = convertFlowType(propertyPath.get('value')) as any;
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
  if (typeParameterPath.node) {
    processTypeParameters(typeParameterPath);
    decl.typeParameters = typeParameterPath.node;
  }

  if (extendsPath.length) {
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
