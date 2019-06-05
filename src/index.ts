import { buildPlugin } from './plugin';
import { ImportDeclaration, ImportSpecifier } from './visitors/import_declaration';
import { OpaqueType } from './visitors/opaque_type';
import { TypeAnnotation, TypeAlias, NullableTypeAnnotation } from './visitors/type_annotation';
import { TypeCastExpression } from './visitors/type_cast_expression';
import { TypeParameterDeclaration } from './visitors/type_parameter_declaration';
import { ClassMethod, ClassDeclaration } from './visitors/class_declaration';
import { ExportNamedDeclaration, ExportDefaultDeclaration } from './visitors/export_declaration';
import { InterfaceDeclaration } from './visitors/interface_declaration';
import { OptionalMemberExpression } from './visitors/optional_member_expression';
import { DeclareFunction } from './visitors/declare_function';
import { Program } from './visitors/program';

export = buildPlugin([
  Program,
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
  InterfaceDeclaration,
  OptionalMemberExpression,
  DeclareFunction,
]);
