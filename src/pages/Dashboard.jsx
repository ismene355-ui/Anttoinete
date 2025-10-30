import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ClientForm from '../components/ClientForm';
import ClientTable from '../components/ClientTable';

// REMPLACE ICI par tes propres infos Supabase (Settings > API)
const supabaseUrl = 'https://kqdvtzwrlvaruebikbmk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtxZHZ0endybHZhcnVlYmlrYm1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MTM1NzIsImV4cCI6MjA3NzM4OTU3Mn0.1BC_3ttkmOSj4KF_qotmS_-CY4MiV82SoqDb3RNHGMA';
const supabase = createClient(supabaseUrl, supabaseKey);

function StatCard({ label, value, icon, bg }) {
  return (
    <div className={`flex flex-col items-center gap-1 rounded-xl px-4 py-3 text-center shadow-sm ${bg} text-white`}>
      <span className="text-xl">{icon}</span>
      <span className="text-lg font-bold leading-tight tracking-wide">{value}</span>
      <span className="text-xs opacity-90">{label}</span>
    </div>
  );
}

export default function Dashboard() {
  const [clients, setClients] = useState([]);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError('Erreur lors du chargement.');
    setClients(data || []);
    setLoading(false);
  }

  async function handleAddOrEdit(client) {
    setError(null);
    if (client.id) {
      // update
      const { error } = await supabase
        .from('clients')
        .update({
          name: client.name,
          phone: client.phone,
          email: client.email,
          amountDue: client.amountDue,
          amountPaid: client.amountPaid,
          status: client.status,
        })
        .eq('id', client.id);
      if (error) setError("Erreur de modification : " + error.message);
    } else {
      // insert
      const { error } = await supabase
        .from('clients')
        .insert([{
          name: client.name,
          phone: client.phone,
          email: client.email,
          amountDue: client.amountDue,
          amountPaid: client.amountPaid,
          status: client.status,
        }]);
      if (error) setError("Erreur d'ajout : " + error.message);
    }
    setEditing(null);
    fetchClients();
  }

  async function handleDelete(id) {
    setError(null);
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) setError("Erreur suppression : " + error.message);
    setEditing(null);
    fetchClients();
  }

  async function handleStatusChange(id, status) {
    setError(null);
    const { error } = await supabase
      .from('clients')
      .update({ status })
      .eq('id', id);
    if (error) setError("Erreur status : " + error.message);
    fetchClients();
  }

  const totalDue = clients.reduce((sum, c) => sum + (parseFloat(c.amountDue) || 0), 0);
  const totalPaid = clients.reduce((sum, c) => sum + (parseFloat(c.amountPaid) || 0), 0);
  const percentPaid = totalDue > 0 ? Math.round((totalPaid / totalDue) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-300 pb-16 font-sans transition-colors">
      <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 w-full z-20 transition-colors">
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white font-bold shadow">💼</span>
            <span className="ml-2 text-2xl md:text-3xl font-extrabold text-indigo-700 drop-shadow-sm tracking-tight">
              Gestion des Clients
            </span>
          </div>
          <span className="hidden md:block text-xs text-gray-500 font-light">by Ismene</span>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 -mt-8 flex flex-col items-stretch">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4 mb-7 mt-8">
          <StatCard label="Clients" value={clients.length} icon="👥" bg="bg-indigo-600" />
          <StatCard label="Montant total dû" value={totalDue.toLocaleString() + ' €'} icon="💰" bg="bg-amber-500" />
          <StatCard label="Montant payé" value={totalPaid.toLocaleString() + ' €'} icon="✅" bg="bg-green-500" />
          <StatCard label="% réglé" value={percentPaid + ' %'} icon="📈" bg="bg-blue-500" />
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-2">
        {error && (
          <div className="mb-4 text-red-700 bg-red-100 border-l-4 border-red-400 py-2 px-4 rounded-xl shadow animate-fadein">{error}</div>
        )}
        {loading ? <div className="text-center text-lg py-14 text-indigo-500 font-semibold animate-fadein">Chargement...</div> : (
          <>
            <ClientForm
              onSubmit={handleAddOrEdit}
              editingClient={editing}
              onCancel={() => setEditing(null)}
            />
            <div className="mt-8">
              <ClientTable
                clients={clients}
                onEdit={setEditing}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                search={search}
                setSearch={setSearch}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}