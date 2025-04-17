import { nodata2 } from '@/constant';
import React from 'react';

const EmptyState = ({nom, search}) => (
  <div className="flex flex-col items-center justify-center py-12 mt-4">
    <img src={nodata2} alt="Aucune donnée" className="w-64 opacity-60 mb-6" />
    <h3 className="text-xl font-semibold text-gray-600 mb-2">Aucun {nom} trouvé</h3>
    {search && <p className="text-gray-500 text-center max-w-md">
      Il n'y a pas de {nom}s correspondant à votre recherche. Essayez de modifier vos critères ou ajoutez un nouveau {nom}.
    </p>}
  </div>
);

export default EmptyState;