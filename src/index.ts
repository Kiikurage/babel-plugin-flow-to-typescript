import {buildPlugin} from './plugin';
import {ImportDeclaration, ImportSpecifier} from './visitors/import_declaration';
import {OpaqueType} from './visitors/opaque_type';
import {TypeAnnotation, TypeAlias} from './visitors/type_annotation';
import {TypeCastExpression} from './visitors/type_cast_expression';
import {TypeParameterDeclaration} from './visitors/type_parameter_declaration';
import {TypeAlias} from './visitors/type_alias';

export = buildPlugin([
    TypeAlias,
    TypeAnnotation,
    TypeAlias,
    TypeParameterDeclaration,
    ImportDeclaration,
    ImportSpecifier,
    TypeCastExpression,
    OpaqueType
]);