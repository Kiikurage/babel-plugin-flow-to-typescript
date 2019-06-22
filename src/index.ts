import { buildPlugin } from './plugin';
import { ImportDeclaration, ImportSpecifier } from './visitors/import_declaration';
import { OpaqueType } from './visitors/opaque_type';
import { TypeAnnotation, TypeAlias, NullableTypeAnnotation } from './visitors/type_annotation';
import { TypeCastExpression } from './visitors/type_cast_expression';
import { TypeParameterDeclaration } from './visitors/type_parameter_declaration';
import { ClassMethod, ClassDeclaration } from './visitors/class_declaration';
import { ExportNamedDeclaration, ExportDefaultDeclaration } from './visitors/export_declaration';

export default buildPlugin([
  TypeAnnotation,
  TypeAlias,
  NullableTypeAnnotation,
  TypeParameterDeclaration,
  ImportDeclaration,
  ImportSpecifier,
  TypeCastExpression,
  OpaqueType,
  ClassMethod,
  ClassDeclaration,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
]);
