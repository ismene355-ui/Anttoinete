import React, { useState, useEffect } from 'react';

const initialState = {
  id: null,
  name: '',
  phone: '',
  email: '',
  amountDue: '',
  amountPaid: '',
  status: 'non-payé',
};

const statusHelp = {
  'non-payé': 'Aucun paiement reçu',
  'avance': 'Le client a payé une partie',
  'payé': 'Tout est payé',
};

export default function ClientForm({ onSubmit, editingClient, onCancel }) {
  const [client, setClient] = useState(initialState);

  useEffect(() => {
    if (editingClient) {
      setClient(editingClient);
    } else {
      setClient(initialState);
    }
  }, [editingClient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!client.name.trim() || !client.phone.trim()) return;
    onSubmit(client);
    setClient(initialState);
  };

  const amountDue = parseFloat(client.amountDue) || 0;
  const amountPaid = parseFloat(client.amountPaid) || 0;
  const rest = amountDue - amountPaid;
  const legalRest = !isNaN(amountDue) && !isNaN(amountPaid) && amountDue > 0 && amountPaid >= 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/80 shadow-2xl flex flex-col gap-8 w-full max-w-lg mx-auto p-8 rounded-2xl border border-indigo-100 animate-fadein"
      aria-label={editingClient ? 'Modifier le client' : 'Ajouter un nouveau client'}
    >
      <h2 className="text-2xl font-extrabold text-indigo-700 mb-0 tracking-tight">
        {editingClient ? 'Modifier le client' : 'Ajouter un client'}
      </h2>
      <div className="text-sm text-gray-600 mb-2">
        Les champs marqués <span className="text-pink-600">*</span> sont obligatoires. Indiquez le numéro de téléphone et le montant total à payer (complet ou moitié).<br/>
        <span className="text-[13px] text-indigo-500">Vous pouvez aussi préciser l’email pour envoyer un reçu ou une relance.</span>
      </div>
      <div className="flex flex-col gap-2 pb-1 border-b border-indigo-50">
        <label className="font-semibold text-gray-800">Nom complet <span className="text-pink-600">*</span></label>
        <input
          type="text"
          name="name"
          value={client.name}
          onChange={handleChange}
          autoFocus
          required
          placeholder="Ex : Jean Dupont"
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-800">Numéro de téléphone <span className="text-pink-600">*</span></label>
        <input
          type="tel"
          name="phone"
          value={client.phone}
          onChange={handleChange}
          required
          placeholder="Ex : 07 00 00 00 00"
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
        />
        <span className="text-xs text-gray-400 ml-1">Assurez-vous d’un numéro valide</span>
      </div>
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-800">Adresse e-mail (facultatif)</label>
        <input
          type="email"
          name="email"
          value={client.email}
          onChange={handleChange}
          placeholder="nom@exemple.com"
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition"
        />
      </div>

      <div className="py-2 border-b border-indigo-50 flex flex-col gap-2 mt-2">
        <label className="font-semibold text-indigo-800">Montant total à payer (€) <span className="text-pink-600">*</span></label>
        <input
          type="number"
          name="amountDue"
          value={client.amountDue}
          min={0}
          required
          placeholder="Ex : 200"
          onChange={handleChange}
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
        />
        <span className="text-xs text-gray-400 ml-1">Prix complet (ou montant d’acompte si paiement partiel accepté)</span>
      </div>
      <div className="flex flex-col gap-2 -mt-1">
        <label className="font-semibold text-indigo-800">Montant déjà payé (€)</label>
        <input
          type="number"
          name="amountPaid"
          value={client.amountPaid}
          min={0}
          placeholder="Ex : 60"
          onChange={handleChange}
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-2 focus:ring-green-200 transition"
        />
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 ml-1">Indiquez seulement ce qui est déjà versé.</span>
          {legalRest ? (
            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border ${rest > 0 ? 'border-pink-500' : 'border-green-500'}`}>
              Reste à payer : {Math.max(0, rest).toLocaleString()} €
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-3">
        <label className="font-semibold text-gray-800 flex items-center">Statut du paiement
          <span title="Explications sur les statuts" className="ml-1 text-xs text-blue-500 cursor-help">🛈</span>
        </label>
        <select
          name="status"
          value={client.status}
          onChange={handleChange}
          className="input input-bordered w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition font-semibold text-sm"
        >
          <option value="non-payé">Non payé</option>
          <option value="avance">Avance donnée</option>
          <option value="payé">A payé</option>
        </select>
        <span className="text-xs text-gray-400 pl-1">
          {statusHelp[client.status]}
        </span>
      </div>

      <div className="flex gap-4 mt-6 justify-end">
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-600 text-white px-8 py-2 rounded-xl font-bold text-lg shadow hover:scale-105 hover:bg-indigo-600 transition-transform duration-150 focus:ring focus:ring-indigo-200 w-full"
        >
          {editingClient ? 'Mettre à jour' : 'Ajouter le client'}
        </button>
        {editingClient && (
          <button
            type="button"
            className="bg-gray-200 px-8 py-2 rounded-xl font-bold text-gray-600 hover:bg-gray-400 hover:text-white transition"
            onClick={onCancel}
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
