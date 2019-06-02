import { ClassMethod, ClassDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertClassConstructor } from '../converters/convert_class_constructor';
import { convertFlowType } from '../converters/convert_flow_type';
import { convertTypeParameter } from '../converters/convert_type_parameter';

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
