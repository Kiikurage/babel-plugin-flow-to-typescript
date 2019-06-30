import {
  identifier,
  ObjectTypeIndexer,
  tsIndexSignature,
  tsTypeAnnotation,
} from '@babel/types';

import { convertFlowType } from './convert_flow_type';

export function convertObjectTypeIndexer(indexer: ObjectTypeIndexer) {
  const tsIndex = indexer.id || identifier('x');
  tsIndex.typeAnnotation = tsTypeAnnotation(convertFlowType(indexer.key));
  return tsIndexSignature([tsIndex], tsTypeAnnotation(convertFlowType(indexer.value)));
}
