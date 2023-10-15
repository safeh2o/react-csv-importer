import React from 'react';

import { TextButton } from '../TextButton';

import './FormatErrorMessage.scss';
import { useLocale } from '../../locale/LocaleContext';

export const FormatErrorMessage: React.FC<{
  onCancelClick: () => void;
  children: React.ReactNode;
}> = React.memo(function MemoizedFormatErrorMessage({
  onCancelClick,
  children
}) {
  const l10n = useLocale('fileStep');
  return (
    <div className="CSVImporter_FormatErrorMessage">
      <span>{children}</span>
      <TextButton onClick={onCancelClick}>{l10n.goBackButton}</TextButton>
    </div>
  );
});
