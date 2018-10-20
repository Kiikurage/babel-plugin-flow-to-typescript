import {buildPlugin} from './plugin';
import {ImportDeclaration, ImportSpecifier} from './visitors/import_declaration';
import {OpaqueType} from './visitors/opaque_type';
import {TypeAnnotation} from './visitors/type_annotation';
import {TypeCastExpression} from './visitors/type_cast_expression';
import {TypeParameterDeclaration} from './visitors/type_parameter_declaration';

export = buildPlugin([
    TypeAnnotation,
    TypeParameterDeclaration,
    ImportDeclaration,
    ImportSpecifier,
    TypeCastExpression,
    OpaqueType
]);