import { PluginObj, Visitor } from '@babel/core';
import { ImportDeclaration, ImportSpecifier } from './visitors/import_declaration';
import { OpaqueType } from './visitors/opaque_type';
import { TypeAnnotation } from './visitors/type_annotation';
import { TypeCastExpression } from './visitors/type_cast_expression';
import { TypeParameterDeclaration } from './visitors/type_parameter_declaration';
import { ClassMethod } from './visitors/class_method';
import { ClassDeclaration } from './visitors/class_declaration';
import { DeclareClass } from './visitors/declare_class';
import { ExportNamedDeclaration } from './visitors/export_declaration';
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
import { DeclareOpaqueType } from './visitors/declare_opaque_type';
import { DeclareModuleExports } from './visitors/declare_module_exports';
import DeclareModule from './visitors/declare_module';
import { DeclareExportDeclaration } from './visitors/declare_export_declaration';
import { NewExpression } from './visitors/new_expression';
import { ArrowFunctionExpression } from './visitors/arrow_function_expression';
import { PluginOptions, PluginPass } from './types';

const visitor: Visitor<PluginPass> = {
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
  ClassExpression: ClassDeclaration,
  ExportNamedDeclaration,
  InterfaceDeclaration,
  OptionalMemberExpression,
  DeclareFunction,
  FunctionDeclaration,
  CallExpression,
  DeclareVariable,
  DeclareTypeAlias,
  DeclareInterface,
  DeclareOpaqueType,
  DeclareModuleExports,
  DeclareModule,
  DeclareExportDeclaration,
  NewExpression,
  ArrowFunctionExpression,
};

// tslint:disable-next-line:no-any
export default (_babel: any, opts: PluginOptions) => {
  if (typeof opts.isJSX === 'undefined') {
    opts.isJSX = true;
  }
  return {
    name: 'babel-plugin-flow-to-typescript',
    visitor,

    manipulateOptions(opts: PluginOptions, parserOpts) {
      parserOpts.plugins.push('flow');
      if (opts.isJSX) {
        parserOpts.plugins.push('jsx');
      }
      parserOpts.plugins.push('classProperties');
      parserOpts.plugins.push('objectRestSpread');
      parserOpts.plugins.push('optionalChaining');
      parserOpts.plugins.push('dynamicImport');
    },
  } as PluginObj;
};
