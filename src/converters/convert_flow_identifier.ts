import {
  Identifier,
  isIdentifier,
  QualifiedTypeIdentifier,
  TSQualifiedName,
  tsQualifiedName,
} from '@babel/types';

// A.B.C -> A.B.C
export function convertFlowIdentifier(
  id: QualifiedTypeIdentifier | Identifier,
): TSQualifiedName | Identifier {
  if (isIdentifier(id)) {
    return id;
  }
  return tsQualifiedName(convertFlowIdentifier(id.qualification), id.id);
}
