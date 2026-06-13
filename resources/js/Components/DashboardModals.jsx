import { X, FileText, Download, Save, ShieldAlert, CheckCircle, Mail, Phone, User, Lock, Edit2 } from 'lucide-react';
import { Inertia } from '@inertiajs/inertia';

export function StudentCvModal({ selectedStudentCv, handleSimulatedCvDownload, setSelectedStudentCv, calculateMoyenne }) {
  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[800px]">
        <div className="bg-[#131d31] border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="text-[#2b82c9] w-5 h-5" />
            <span className="font-mono text-xs text-slate-400 truncate">{selectedStudentCv.cvName}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSimulatedCvDownload(selectedStudentCv)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Download size={13} /> Télécharger
            </button>
            <button onClick={() => setSelectedStudentCv(null)} className="text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-white text-slate-900 font-sans relative">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="border-b-2 border-[#2b82c9] pb-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-[#131d31]">{selectedStudentCv.prenom} {selectedStudentCv.nom}</h2>
                <p className="text-[#2b82c9] font-semibold text-sm mt-1">Étudiant à la FST Settat</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Code Étudiant : {selectedStudentCv.code}</p>
              </div>
              <div className="text-right text-xs text-slate-600 space-y-1">
                <p>{selectedStudentCv.cvEmail}</p>
                <p>{selectedStudentCv.cvPhone}</p>
                <p>{selectedStudentCv.ville || 'Settat, Maroc'}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b82c9]">Profil Professionnel</h3>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">{selectedStudentCv.cvBio}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b82c9]">Cursus Académique</h3>
              <div className="border-l-2 border-slate-200 pl-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-800">
                    <h4>Faculté des Sciences et Techniques (FST Settat)</h4>
                    <span className="text-xs text-slate-500">2023 - Présent</span>
                  </div>
                  <p className="text-xs text-[#2b82c9] font-medium">Diplôme Universitaire de Technologie (DUT) / Cycle Ingénieur</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Moyenne générale calculée sur les notes actuelles : <span className="font-semibold text-slate-700">{calculateMoyenne(selectedStudentCv.note1, selectedStudentCv.note2, selectedStudentCv.note3)}/20</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b82c9]">Compétences & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStudentCv.cvSkills && selectedStudentCv.cvSkills.map((skill, index) => (
                  <span key={index} className="bg-slate-100 text-slate-800 text-xs px-3 py-1 rounded-full font-medium border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#2b82c9]">Projets Académiques</h3>
              <div className="space-y-2">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-800">Projet Let'Study Dashboard</h4>
                  <p className="text-xs text-slate-600 mt-1">Conception et développement d'un tableau de bord de gestion d'étudiants en React avec une persistance de données Laravel & phpMyAdmin.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#131d31] border-t border-slate-800 px-6 py-4 flex justify-between items-center">
          <span className="text-xs text-slate-500">Visualiseur de fichiers PDF - Let'Study Enterprise</span>
          <button
            onClick={() => setSelectedStudentCv(null)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Fermer l'aperçu
          </button>
        </div>
      </div>
    </div>
  );
}

export function EditStudentModal({ editingStudent, setEditingStudent, handleUpdateStudent, calculateMoyenne }) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-lg rounded-xl overflow-hidden shadow-2xl">
        <div className="bg-[#2b82c9] px-6 py-4 flex items-center justify-between text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Edit2 size={18} /> Modifier l'Étudiant et ses Notes
          </h3>
          <button onClick={() => setEditingStudent(null)} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleUpdateStudent} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Code Étudiant (Fixe)</label>
              <input
                type="text"
                readOnly
                value={editingStudent.code}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-400 text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Moyenne Actuelle</label>
              <div className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-emerald-400 font-bold text-sm">
                {calculateMoyenne(editingStudent.note1, editingStudent.note2, editingStudent.note3)} / 20
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nom</label>
              <input
                type="text"
                required
                value={editingStudent.nom}
                onChange={(e) => setEditingStudent({ ...editingStudent, nom: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Prénom</label>
              <input
                type="text"
                required
                value={editingStudent.prenom}
                onChange={(e) => setEditingStudent({ ...editingStudent, prenom: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Latitude (Carte)</label>
              <input
                type="number"
                step="0.0001"
                value={editingStudent.lat}
                onChange={(e) => setEditingStudent({ ...editingStudent, lat: parseFloat(e.target.value) || 33.0 })}
                className="w-full bg-slate-900 border border-slate-750 rounded px-2 py-1 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Longitude (Carte)</label>
              <input
                type="number"
                step="0.0001"
                value={editingStudent.lng}
                onChange={(e) => setEditingStudent({ ...editingStudent, lng: parseFloat(e.target.value) || -7.0 })}
                className="w-full bg-slate-900 border border-slate-750 rounded px-2 py-1 text-xs text-white"
              />
            </div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-sky-400">Modifier les notes</h4>
            <div className="grid grid-cols-3 gap-3">
              {['note1', 'note2', 'note3'].map((field, idx) => (
                <div key={field}>
                  <label className="block text-xs text-slate-400 mb-1">Note {idx + 1}</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    value={editingStudent[field]}
                    onChange={(e) => setEditingStudent({ ...editingStudent, [field]: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-center text-sm text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => setEditingStudent(null)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#2b82c9] hover:bg-sky-600 rounded-lg text-sm text-white flex items-center gap-1.5 transition-colors shadow-md"
            >
              <Save size={16} /> Enregistrer dans phpMyAdmin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AdminProfileModal({
  adminProfile,
  setAdminProfile,
  activeProfileTab,
  setActiveProfileTab,
  passwordForm,
  passwordError,
  passwordSuccess,
  handleUpdateAdminProfile,
  handleChangeAdminPassword,
  setPasswordForm,
  setIsProfileOpen
}) {
  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-[#131d31] border-b border-slate-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white" style={{ backgroundColor: adminProfile.avatarColor }}>
              {adminProfile.nom[0]}
            </div>
            <h3 className="font-bold text-lg">Mon Profil {adminProfile.role === 'admin' ? 'Administrateur' : 'Étudiant'}</h3>
          </div>
          <button
            onClick={() => {
              setIsProfileOpen(false);
              setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }}
            className="text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex border-b border-slate-800 bg-[#162235]">
          <button
            onClick={() => setActiveProfileTab('info')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeProfileTab === 'info'
                ? 'border-[#2b82c9] text-white bg-slate-800/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User size={16} /> Informations Générales
          </button>
          <button
            onClick={() => setActiveProfileTab('security')}
            className={`flex-1 py-3 text-center text-sm font-semibold border-b-2 transition-all flex items-center justify-center gap-2 ${
              activeProfileTab === 'security'
                ? 'border-[#2b82c9] text-white bg-slate-800/30'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock size={16} /> Sécurité & Mot de passe
          </button>
        </div>
        <div className="p-6">
          {activeProfileTab === 'info' && (
            <form onSubmit={handleUpdateAdminProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nom d'affichage</label>
                  <input
                    type="text"
                    required
                    value={adminProfile.nom}
                    onChange={(e) => setAdminProfile({ ...adminProfile, nom: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nom d'utilisateur (Identifiant)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-sm font-medium">@</span>
                    <input
                      type="text"
                      required
                      value={adminProfile.username}
                      onChange={(e) => setAdminProfile({ ...adminProfile, username: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Adresse Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={adminProfile.email}
                      onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Numéro de Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                      type="text"
                      required
                      value={adminProfile.telephone}
                      onChange={(e) => setAdminProfile({ ...adminProfile, telephone: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Couleur de l'Avatar du Compte</label>
                <div className="flex gap-3">
                  {['#2b82c9', '#e85d04', '#10b981', '#8b5cf6', '#f43f5e'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setAdminProfile({ ...adminProfile, avatarColor: color })}
                      className="w-8 h-8 rounded-full border-2 transition-transform focus:outline-none hover:scale-110"
                      style={{
                        backgroundColor: color,
                        borderColor: adminProfile.avatarColor === color ? '#ffffff' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  Annuler
                </button>
                  <button
                    type="button"
                    onClick={() => {
                      // close modal locally immediately to remove UI before navigation
                      setIsProfileOpen(false);

                      // perform a plain fetch POST to avoid Inertia client-side page handling issues
                      const xsrf = (function() {
                        const m = document.cookie.match(new RegExp('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)'));
                        return m ? decodeURIComponent(m[2]) : null;
                      })();

                      fetch(route('logout'), {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-Requested-With': 'XMLHttpRequest',
                          ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify({}),
                      })
                        .then(() => {
                          window.location.replace(route('login'));
                        })
                        .catch(() => {
                          // fallback to full redirect if fetch fails
                          window.location.replace(route('login'));
                        });
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-lg text-sm text-white transition-colors"
                  >
                    Se déconnecter
                  </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2b82c9] hover:bg-sky-600 rounded-lg text-sm text-white flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Save size={16} /> Enregistrer le Profil
                </button>
              </div>
            </form>
          )}

          {activeProfileTab === 'security' && (
            <form onSubmit={handleChangeAdminPassword} className="space-y-4">
              {passwordError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg flex items-center gap-2">
                  <ShieldAlert size={16} className="shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Mot de passe actuel</label>
                <input
                  type="password"
                  required
                  placeholder="Saisissez votre mot de passe actuel"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 caractères"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    required
                    placeholder="Répétez le mot de passe"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9] transition-colors"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsProfileOpen(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Save size={16} /> Changer le Mot de passe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
