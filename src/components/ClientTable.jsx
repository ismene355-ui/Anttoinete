import React from 'react';

const statusMap = {
  'non-payé': 'bg-red-500/90 text-white',
  'avance': 'bg-orange-400/90 text-white',
  'payé': 'bg-green-500/90 text-white',
};
const statusIcon = {
  'non-payé': '⛔',
  'avance': '⌛',
  'payé': '✔️',
};

export default function ClientTable({ clients, onEdit, onDelete, onStatusChange, search, setSearch }) {
  const filteredClients = clients.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full overflow-x-auto">
      <div className="py-4 flex flex-col md:flex-row md:justify-between gap-2">
        <input
          className="input input-bordered rounded-lg px-3 py-2 border-gray-300 w-full max-w-xs focus:ring focus:ring-indigo-300 shadow"
          placeholder="Rechercher par nom ou téléphone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-xl bg-white/75 backdrop-blur-lg shadow-lg overflow-x-auto border border-gray-200">
      <table className="min-w-full text-base md:text-sm">
        <thead>
          <tr className="bg-gray-100/70 text-gray-700 uppercase text-xs">
            <th className="py-3 px-4 text-left">Nom</th>
            <th className="py-3 px-4 text-left">Téléphone</th>
            <th className="py-3 px-4 text-left">Email</th>
            <th className="py-3 px-4 text-right">Montant dû</th>
            <th className="py-3 px-4 text-right">Montant payé</th>
            <th className="py-3 px-4 text-center">Statut</th>
            <th className="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.length === 0 && (
            <tr className="text-center">
              <td colSpan={7} className="py-6 text-gray-400 font-medium tracking-wide">Aucun client trouvé.</td>
            </tr>
          )}
          {filteredClients.map((client) => (
            <tr key={client.id} className="border-t border-gray-200 hover:bg-indigo-50 transition">
              <td className="py-2 px-4 font-semibold whitespace-nowrap">{client.name}</td>
              <td className="py-2 px-4 whitespace-nowrap">{client.phone}</td>
              <td className="py-2 px-4 whitespace-nowrap">{client.email || '-'}</td>
              <td className="py-2 px-4 text-right">{client.amountDue || 0} €</td>
              <td className="py-2 px-4 text-right">{client.amountPaid || 0} €</td>
              <td className="py-2 px-4 text-center">
                <span className={`inline-flex items-center gap-1 px-3 py-1 mb-1 rounded-2xl text-sm font-bold shadow-sm ${statusMap[client.status]}`}
                  title={
                    client.status === 'non-payé'
                      ? 'Le client n’a rien payé'
                      : client.status === 'avance'
                      ? 'Le client a donné une avance'
                      : 'Le client est à jour, tout est payé.'
                  }
                >
                  <span className="text-lg">{statusIcon[client.status]}</span>
                  <span>
                  {client.status === 'non-payé' && 'Non payé'}
                  {client.status === 'avance' && 'Avance'}
                  {client.status === 'payé' && 'Réglé'}
                  </span>
                </span>
                <select
                  value={client.status}
                  onChange={e => onStatusChange(client.id, e.target.value)}
                  className="ml-2 rounded px-2 py-1 border border-gray-200 bg-gray-50 text-xs cursor-pointer focus:ring focus:ring-indigo-200"
                >
                  <option value="non-payé">Non payé</option>
                  <option value="avance">Avance</option>
                  <option value="payé">Réglé</option>
                </select>
              </td>
              <td className="py-2 px-4 flex gap-2 justify-center">
                <button
                  className="px-3 py-1 bg-blue-500/90 text-white rounded-lg shadow hover:scale-105 hover:bg-blue-700 transition-transform duration-150 focus:ring focus:ring-blue-200 text-xs font-bold"
                  title="Modifier"
                  onClick={() => onEdit(client)}
                >
                  ✏️
                </button>
                <button
                  className="px-3 py-1 bg-red-500/80 text-white rounded-lg shadow hover:scale-105 hover:bg-red-700 transition-transform duration-150 focus:ring focus:ring-red-200 text-xs font-bold"
                  title="Supprimer"
                  onClick={() => onDelete(client.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
