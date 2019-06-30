import { PluginObj, Visitor } from '@babel/core';
import { ImportDeclaration, ImportSpecifier } from './visitors/import_declaration';
import { OpaqueType } from './visitors/opaque_type';
import { TypeAnnotation } from './visitors/type_annotation';
import { TypeCastExpression } from './visitors/type_cast_expression';
import { TypeParameterDeclaration } from './visitors/type_parameter_declaration';
import { ClassMethod, ClassDeclaration, DeclareClass } from './visitors/class_declaration';
import { ExportNamedDeclaration, ExportDefaultDeclaration } from './visitors/export_declaration';
import { InterfaceDeclaration } from './visitors/interface_declaration';
import { OptionalMemberExpression } from './visitors/optional_member_expression';
import { DeclareFunction } from './visitors/declare_function';
import Program from './visitors/program';
import { TypeAlias } from './visitors/type_alias';
import { FunctionDeclaration } from './visitors/function_declaration';
import { CallExpression } from './visitors/call_expression';
import { DeclareVariable } from './visitors/declare_variable';
import { DeclareTypeAlias } from './visitors/declare_type_alias';
import { DeclareInterface } from './visitors/declare_interface';

const visitor: Visitor = {
  Program,
  TypeAnnotation,
  TypeAlias,
  TypeParameterDeclaration,
  ImportDeclaration,
  ImportSpecifier,
  TypeCastExpression,
  OpaqueType,
  ClassMethod,
  DeclareClass,
  ClassDeclaration,
  ExportNamedDeclaration,
  ExportDefaultDeclaration,
  InterfaceDeclaration,
  OptionalMemberExpression,
  DeclareFunction,
  FunctionDeclaration,
  CallExpression,
  DeclareVariable,
  DeclareTypeAlias,
  DeclareInterface,
};

export default () =>
  ({
    name: 'babel-plugin-flow-to-typescript',
    visitor,

    manipulateOptions(_opts, parserOpts) {
      parserOpts.plugins.push('flow');
      parserOpts.plugins.push('jsx');
      parserOpts.plugins.push('classProperties');
      parserOpts.plugins.push('objectRestSpread');
      parserOpts.plugins.push('optionalChaining');
    },
  } as PluginObj);
