import { NodePath } from '@babel/traverse';
import { FlowType, TSType } from '@babel/types';
export declare function convertFlowType(path: NodePath<FlowType>): TSType;
