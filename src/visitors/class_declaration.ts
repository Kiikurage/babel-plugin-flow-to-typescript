import { ClassMethod, ClassDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';
import { convertClassConstructor } from '../converters/convert_class_constructor';
import { convertFlowType } from '../converters/convert_flow_type';

export function ClassMethod(path: NodePath<ClassMethod>) {
  if (path.node.kind === 'constructor') {
    path.replaceWith(convertClassConstructor(path));
  }
}

// tslint:disable-next-line:no-any
function processTypeParameters(typeParameterPath: any) {
  // tslint:disable-next-line:no-any
  typeParameterPath.node.params = typeParameterPath.node.params.map((_: any, i: number) =>
    convertFlowType(typeParameterPath.get(`params.${i}`)),
  );
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
