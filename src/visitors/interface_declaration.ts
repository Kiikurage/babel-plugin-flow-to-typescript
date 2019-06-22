import { InterfaceDeclaration } from '@babel/types';
import { NodePath } from '@babel/traverse';

import { convertInterfaceDeclaration } from '../converters/convert_interface_declaration';

export function InterfaceDeclaration(path: NodePath<InterfaceDeclaration>) {
  path.replaceWith(convertInterfaceDeclaration(path));
}
