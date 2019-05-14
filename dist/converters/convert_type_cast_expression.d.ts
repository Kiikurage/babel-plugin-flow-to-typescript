import { NodePath } from '@babel/traverse';
import { TSAsExpression, TypeCastExpression } from '@babel/types';
export declare function convertTypeCastExpression(path: NodePath<TypeCastExpression>): TSAsExpression;
