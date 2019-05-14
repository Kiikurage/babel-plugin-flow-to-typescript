import { TypeAnnotation, TypeAlias, NullableTypeAnnotation } from '@babel/types';
import { NodePath } from '@babel/traverse';
export declare function TypeAnnotation(path: NodePath<TypeAnnotation>): void;
export declare function TypeAlias(path: NodePath<TypeAlias>): void;
export declare function NullableTypeAnnotation(path: NodePath<NullableTypeAnnotation>): void;
