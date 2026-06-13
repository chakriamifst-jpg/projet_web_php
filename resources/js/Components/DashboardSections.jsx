import {
  Grid,
  MapPin,
  HelpCircle,
  BookOpen,
  Award,
  Image as ImageIcon,
  FileText,
  Database,
  Plus,
  Sparkles,
  RefreshCw,
  CheckCircle,
  Eye,
  Download,
  Search,
  Upload,
  Trash2,
  Edit2,
  UserPlus,
  Users,
  Calculator,
  Minus,
  X
} from 'lucide-react';
import ApiLogsPanel from './ApiLogs';

export function HomeSection({ setActiveTab, isStudent }) {
  return (
    <div className="max-w-4xl py-12 relative z-10">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl -translate-y-1/4 pointer-events-none"></div>
      <h2 className="text-5xl font-extrabold leading-tight mb-6">
        Apprends, progresse et <span className="text-amber-400">réussis</span><br />
        avec Let'Study <span className="inline-block text-4xl">🎓</span>
      </h2>
      <p className="text-slate-300 text-lg mb-10 max-w-2xl leading-relaxed">
        Une plateforme académique complète pour les étudiants de la FST Settat. Gère tes projets, suis tes notes, et explore tes outils pédagogiques — tout au même endroit.
      </p>
      <button
        onClick={() => setActiveTab(isStudent ? 'Ma localisation' : 'Formulaire')}
        className="bg-[#2b82c9] hover:bg-sky-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center gap-2 group shadow-lg"
      >
        {isStudent ? 'Entrer ma localisation' : 'Consulter la liste des étudiants'}
        <span className="transform group-hover:translate-x-1 transition-transform">→</span>
      </button>
    </div>
  );
}

export function GeolocationSection({ students, calculateMoyenne, leafletLoaded, focusOnStudent }) {
  return (
    <div className="flex-1 flex flex-col space-y-4 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="text-[#2b82c9]" /> Cartographie des Étudiants FST
          </h2>
          <p className="text-sm text-slate-400">
            Cliquez sur un étudiant dans la barre latérale pour le centrer et afficher sa fiche académique sur la carte.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Leaflet Engine Ready
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[450px]">
        <div className="lg:col-span-1 bg-[#141f32]/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-y-auto max-h-[550px] lg:max-h-none">
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-[#2b82c9] border-b border-slate-800 pb-2">
              Fiches Étudiant ({students.length})
            </h3>
            <div className="space-y-2.5">
              {students.map((student) => {
                const moyenne = calculateMoyenne(student.note1, student.note2, student.note3);
                const isRed = parseFloat(moyenne) < 10;
                return (
                  <div
                    key={student.id}
                    onClick={() => focusOnStudent(student)}
                    className="p-3 bg-slate-800/40 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center font-bold text-xs text-[#2b82c9] group-hover:bg-[#2b82c9] group-hover:text-white transition-colors">
                        {student.prenom[0]}{student.nom[0]}
                      </div>
                      <div>
                        <h4 className="font-semibold text-xs text-slate-200 group-hover:text-white transition-colors">{student.prenom} {student.nom}</h4>
                        <p className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                          <MapPin size={8} /> {student.ville || 'Settat'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        isRed ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {moyenne}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed">
            Les coordonnées de géolocalisation sont connectées à votre base de données Laravel pour la mise à jour à la volée.
          </div>
        </div>

        <div className="lg:col-span-3 h-[500px] lg:h-auto min-h-[400px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-inner">
          {!leafletLoaded && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="animate-spin text-[#2b82c9] w-8 h-8" />
              <p className="text-xs text-slate-400 font-mono">Chargement de l'API cartographique Leaflet...</p>
            </div>
          )}
          <div id="map-container" className="w-full h-full z-10"></div>
        </div>
      </div>
    </div>
  );
}

export function StudentLocationSection({ currentStudent, studentLocation, setStudentLocation, handleSubmitLocation, locationMessage }) {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-6">
      <div className="bg-[#141f32]/90 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Ma localisation</h2>
            <p className="text-sm text-slate-400">Entrez votre position pour que l'administration puisse vous localiser sur la carte.</p>
          </div>
          <span className="inline-flex items-center rounded-full bg-slate-800/80 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
            {currentStudent ? `${currentStudent.prenom} ${currentStudent.nom}` : 'Utilisateur étudiant'}
          </span>
        </div>

        <form onSubmit={handleSubmitLocation} className="grid gap-4 mt-6 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Latitude</label>
            <input
              type="text"
              value={studentLocation.lat}
              onChange={(e) => setStudentLocation({ ...studentLocation, lat: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Longitude</label>
            <input
              type="text"
              value={studentLocation.lng}
              onChange={(e) => setStudentLocation({ ...studentLocation, lng: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9]"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Ville</label>
            <input
              type="text"
              value={studentLocation.ville}
              onChange={(e) => setStudentLocation({ ...studentLocation, ville: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#2b82c9]"
            />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="w-full bg-[#2b82c9] hover:bg-sky-600 text-white rounded-xl px-5 py-3 font-semibold transition-colors"
            >
              Enregistrer ma localisation
            </button>
          </div>
          {locationMessage && (
            <div className="sm:col-span-3 rounded-2xl border border-slate-800 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {locationMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export function QuizSection({
  selectedQuiz,
  setSelectedQuiz,
  quizData,
  currentQuestionIndex,
  score,
  quizFinished,
  selectedAnswer,
  isAnswered,
  startQuiz,
  handleAnswerSelect,
  validateAnswer,
  goToNextQuestion,
  apiLogs
}) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 w-full flex-1 flex flex-col">
      <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <HelpCircle className="text-[#2b82c9]" /> Quiz Académique Let'Study
          </h2>
          <p className="text-sm text-slate-400">
            Sélectionnez un sujet technique ci-dessous pour lancer une session d'évaluation.
          </p>
        </div>
        {selectedQuiz && (
          <button
            onClick={() => setSelectedQuiz(null)}
            className="self-start sm:self-auto bg-slate-850 hover:bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
          >
            Changer de Quiz
          </button>
        )}
      </div>

      {!selectedQuiz && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 flex-1">
          <div className="bg-[#1e293b]/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm group hover:translate-y-[-2px] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-5 border border-sky-500/20">
                <Grid size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">{quizData.react.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{quizData.react.description}</p>
              <div className="space-y-2 text-xs text-slate-400 font-medium">
                <p className="flex items-center gap-2"><BookOpen size={14} className="text-sky-400" /> 5 Questions théoriques et pratiques</p>
                <p className="flex items-center gap-2"><Award size={14} className="text-sky-400" /> Évaluation notée sur 20 points</p>
              </div>
            </div>
            <button
              onClick={() => startQuiz('react')}
              className="w-full mt-8 bg-[#2b82c9] hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
            >
              Démarrer le Quiz React
            </button>
          </div>

          <div className="bg-[#1e293b]/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm group hover:translate-y-[-2px] transition-all">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-5 border border-amber-500/20">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">{quizData.nextjs.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">{quizData.nextjs.description}</p>
              <div className="space-y-2 text-xs text-slate-400 font-medium">
                <p className="flex items-center gap-2"><BookOpen size={14} className="text-amber-400" /> 5 Questions sur l'écosystème moderne</p>
                <p className="flex items-center gap-2"><Award size={14} className="text-amber-400" /> Évaluation notée sur 20 points</p>
              </div>
            </div>
            <button
              onClick={() => startQuiz('nextjs')}
              className="w-full mt-8 bg-amber-600 hover:bg-amber-500 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md"
            >
              Démarrer le Quiz Next.js
            </button>
          </div>
        </div>
      )}

      {selectedQuiz && !quizFinished && (
        <div className="bg-[#141f32]/90 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>{quizData[selectedQuiz].title}</span>
              <span>Question {currentQuestionIndex + 1} sur 5</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">
              <div
                className={`h-full transition-all duration-300 ${
                  selectedQuiz === 'react' ? 'bg-[#2b82c9]' : 'bg-amber-500'
                }`}
                style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
              ></div>
            </div>
            <h3 className="text-lg lg:text-xl font-bold text-white leading-relaxed mb-6">
              {quizData[selectedQuiz].questions[currentQuestionIndex].question}
            </h3>
            <div className="space-y-3.5">
              {quizData[selectedQuiz].questions[currentQuestionIndex].options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectAnswer = idx === quizData[selectedQuiz].questions[currentQuestionIndex].answer;
                let optionStyle = 'bg-[#1e293b]/50 border-slate-755 text-slate-200 hover:bg-slate-800 hover:border-slate-600';
                if (isAnswered) {
                  if (isCorrectAnswer) {
                    optionStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-semibold';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-500/20 border-rose-500 text-rose-400 font-semibold';
                  } else {
                    optionStyle = 'bg-[#1e293b]/20 border-slate-850 text-slate-500';
                  }
                } else if (isSelected) {
                  optionStyle = selectedQuiz === 'react'
                    ? 'bg-[#2b82c9]/20 border-[#2b82c9] text-sky-400 font-semibold shadow-md'
                    : 'bg-amber-500/20 border-amber-500 text-amber-400 font-semibold shadow-md';
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswerSelect(idx)}
                    className={`w-full text-left px-5 py-4 border rounded-xl text-sm transition-all flex items-center justify-between ${optionStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrectAnswer && (
                      <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold"><CheckCircle size={12} /></span>
                    )}
                    {isAnswered && isSelected && !isCorrectAnswer && (
                      <span className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs font-bold">✕</span>
                    )}
                  </button>
                );
              })}
            </div>
            {isAnswered && (
              <div className="mt-6 p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-3 animate-fadeIn">
                <div className="text-amber-400 mt-0.5"><BookOpen size={16} /></div>
                <p>
                  <b className="text-white">Analyse pédagogique : </b>
                  {quizData[selectedQuiz].questions[currentQuestionIndex].explanation}
                </p>
              </div>
            )}
          </div>
          <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end">
            {!isAnswered ? (
              <button
                onClick={validateAnswer}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  selectedAnswer !== null
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-md'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                Soumettre la réponse
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md cursor-pointer transition-all ${
                  selectedQuiz === 'react' ? 'bg-[#2b82c9] hover:bg-sky-600' : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                {currentQuestionIndex + 1 === 5 ? 'Consulter le bilan' : 'Question suivante'}
              </button>
            )}
          </div>
        </div>
      )}

      {selectedQuiz && quizFinished && (
        <div className="bg-[#141f32]/90 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center max-w-xl mx-auto space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-inner">
            <Award size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-white">Évaluation terminée !</h3>
            <p className="text-sm text-slate-400">Vos réponses ont été traitées par le serveur académique.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-850 max-w-sm mx-auto space-y-2">
            <span className="text-xs uppercase tracking-widest font-bold text-slate-500">Réponses correctes :</span>
            <div className="text-4xl font-extrabold text-white">
              {score} <span className="text-lg text-slate-500">/ 5 questions</span>
            </div>
            <div className="text-lg font-bold text-emerald-400 pt-1.5 border-t border-slate-800">
              Note finale : <span className="text-xl font-black">{(score / 5) * 20} / 20</span>
            </div>
          </div>
          <div className="pt-4 flex gap-3 justify-center">
            <button
              onClick={() => startQuiz(selectedQuiz)}
              className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Recommencer
            </button>
            <button
              onClick={() => setSelectedQuiz(null)}
              className="bg-[#2b82c9] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors"
            >
              Liste des Quizs
            </button>
          </div>
        </div>
      )}

      
    </div>
  );
}

export function StudentsTableSection({ students, calculateMoyenne, setEditingStudent, handleDeleteStudent, apiLogs, searchTerm, setSearchTerm }) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-[#2b82c9]" /> Liste des Étudiants FST
          </h2>
          <p className="text-sm text-slate-400">Données récupérées en temps réel depuis phpMyAdmin via l'API Laravel.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher un étudiant..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e293b] text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2b82c9] transition-all"
          />
        </div>
      </div>
      <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#131d31] border-b border-slate-700/60 text-slate-300 text-xs uppercase font-bold tracking-wider">
                <th className="py-4 px-6">Code Étudiant</th>
                <th className="py-4 px-6">Nom & Prénom</th>
                <th className="py-4 px-6 text-center">Note 1</th>
                <th className="py-4 px-6 text-center">Note 2</th>
                <th className="py-4 px-6 text-center">Note 3</th>
                <th className="py-4 px-6 text-center bg-slate-800/20">Moyenne</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm">
              {students.map((student) => {
                const moyenne = calculateMoyenne(student.note1, student.note2, student.note3);
                const isNoteWarning = parseFloat(moyenne) < 10;
                return (
                  <tr key={student.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 font-mono text-[#38bdf8] font-semibold">{student.code}</td>
                    <td className="py-4 px-6 font-medium text-white">{student.nom} {student.prenom}</td>
                    <td className="py-4 px-6 text-center text-slate-300">{student.note1}</td>
                    <td className="py-4 px-6 text-center text-slate-300">{student.note2}</td>
                    <td className="py-4 px-6 text-center text-slate-300">{student.note3}</td>
                            <td className={`py-4 px-6 text-center font-bold bg-slate-800/10 ${
                      isNoteWarning ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {moyenne} / 20
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg transition-colors"
                          title="Modifier les informations ou notes"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors"
                          title="Supprimer l'étudiant"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
     
    </div>
  );
}

export function CvLibrarySection({
  filteredStudents,
  searchTerm,
  setSearchTerm,
  handleSimulatedCvUpload,
  handleSimulatedCvDownload,
  handleSimulatedCvDelete,
  setSelectedStudentCv,
  apiLogs
}) {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="text-[#2b82c9]" /> CVthèque des Étudiants FST
          </h2>
          <p className="text-sm text-slate-400">
            Recherchez, prévisualisez et gérez les CVs des étudiants reliés à la base de données Laravel.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Chercher nom, prénom, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e293b] text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#2b82c9] transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-sm">
            Aucun étudiant trouvé correspondant à votre recherche.
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              key={student.id}
              className="bg-[#1e293b]/80 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#131d31] border border-slate-700 flex items-center justify-center font-bold text-sm text-[#2b82c9]">
                      {student.prenom[0]}{student.nom[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#2b82c9] transition-colors">{student.prenom} {student.nom}</h3>
                      <p className="text-xs text-slate-400 font-mono">{student.code}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    student.hasCv
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  }`}>
                    {student.hasCv ? 'CV En Ligne' : 'Pas de CV'}
                  </span>
                </div>
                <div className="space-y-2 text-xs text-slate-300 border-t border-b border-slate-800/60 py-3 my-3">
                  <p><span className="text-slate-500 font-medium">Email :</span> {student.cvEmail || 'Non spécifié'}</p>
                  <p><span className="text-slate-500 font-medium">Téléphone :</span> {student.cvPhone || 'Non spécifié'}</p>
                  {student.hasCv && (
                    <p className="font-mono text-sky-400 truncate flex items-center gap-1">
                      <FileText size={12} /> {student.cvName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 pt-2">
                {student.hasCv ? (
                  <>
                    <button
                      onClick={() => setSelectedStudentCv(student)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#2b82c9]/10 hover:bg-[#2b82c9]/20 text-[#2b82c9] border border-[#2b82c9]/30 py-2 rounded-lg text-xs font-semibold transition-all"
                    >
                      <Eye size={13} /> Visualiser
                    </button>
                    <button
                      onClick={() => handleSimulatedCvDownload(student)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
                      title="Télécharger le fichier PDF"
                    >
                      <Download size={14} />
                    </button>
                    <button
                      onClick={() => handleSimulatedCvDelete(student.id)}
                      className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors"
                      title="Supprimer le CV du serveur"
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                ) : (
                  <div className="w-full">
                    <label className="w-full flex items-center justify-center gap-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-all">
                      <Upload size={13} /> Ajouter un CV (PDF)
                      <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={(e) => handleSimulatedCvUpload(student.id, e)}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      <ApiLogsPanel
        logs={apiLogs}
        title="Journal des transactions de fichiers (Laravel Storage)"
        emptyMessage="Aucune transaction réseau pour les CV."
      />
    </div>
  );
}

export function AddStudentSection({ newStudent, setNewStudent, handleAddStudent, setActiveTab }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 w-full">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <UserPlus className="text-emerald-400" /> Ajouter un Étudiant
        </h2>
        <p className="text-sm text-slate-400">Insérer directement un nouvel élève et ses notes dans la base de données phpMyAdmin.</p>
      </div>
      <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl p-6 shadow-xl backdrop-blur-sm">
        <form onSubmit={handleAddStudent} className="space-y-4">
          <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
            <p className="text-xs text-slate-400"><span className="font-semibold text-emerald-400">✓ Code étudiant</span> : sera généré automatiquement au format D123456789</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Nom</label>
              <input
                type="text"
                required
                placeholder="Nom"
                value={newStudent.nom}
                onChange={(e) => setNewStudent({ ...newStudent, nom: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Prénom</label>
              <input
                type="text"
                required
                placeholder="Prénom"
                value={newStudent.prenom}
                onChange={(e) => setNewStudent({ ...newStudent, prenom: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                required
                placeholder="exemple@uhp.ac.ma"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mot de passe</label>
              <input
                type="password"
                required
                placeholder="Min. 6 caractères"
                value={newStudent.password}
                onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none"
              />
            </div>
          </div>
          <div className="bg-[#131d31] p-4 rounded-lg border border-slate-800 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-[#2b82c9]">Coordonnées Géographiques</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="33.0028"
                  value={newStudent.lat}
                  onChange={(e) => setNewStudent({ ...newStudent, lat: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  placeholder="-7.6201"
                  value={newStudent.lng}
                  onChange={(e) => setNewStudent({ ...newStudent, lng: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Quartier / Ville</label>
                <input
                  type="text"
                  placeholder="Settat Centre"
                  value={newStudent.ville}
                  onChange={(e) => setNewStudent({ ...newStudent, ville: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 space-y-3">
            <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-400">Saisie des Notes Initiales</h4>
            <div className="grid grid-cols-3 gap-3">
              {['note1', 'note2', 'note3'].map((field, index) => (
                <div key={field}>
                  <label className="block text-xs text-slate-400 mb-1">Note {index + 1} / 20</label>
                  <input
                    type="number"
                    step="0.25"
                    min="0"
                    max="20"
                    placeholder="0"
                    value={newStudent[field]}
                    onChange={(e) => setNewStudent({ ...newStudent, [field]: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-center text-sm text-white focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('Formulaire')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-slate-300 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-sm text-white flex items-center gap-1.5 transition-colors shadow-md"
            >
              <CheckCircle size={16} /> Enregistrer et lier à la BDD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function MatricesSection({
  rows1,
  cols1,
  matrix1,
  rows2,
  cols2,
  matrix2,
  generateRandomMatrix,
  handleDimensionChange,
  handleCellChange,
  additionResult,
  subtractionResult,
  multiplicationResult
}) {
  const renderMatrixInputs = (matrix, matrixNum, rows, cols, handleChange) => (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(45px, 1fr))` }}>
      {matrix.map((row, rIdx) =>
        row.map((cell, cIdx) => (
          <input
            key={`${matrixNum}-${rIdx}-${cIdx}`}
            type="number"
            value={cell}
            onChange={(e) => handleChange(matrixNum, rIdx, cIdx, e.target.value)}
            className="w-12 h-10 bg-[#1e293b] text-center text-sm font-bold text-white border border-slate-700 rounded focus:ring-1 focus:ring-[#2b82c9]"
          />
        ))
      )}
    </div>
  );

  const renderResultGrid = (resultData, cols, cellClass) => (
    <div className="bg-[#111827] p-4 rounded-lg border border-slate-800 flex justify-center overflow-x-auto">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(35px, 1fr))` }}>
        {resultData.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className={`w-10 h-10 ${cellClass} border rounded flex items-center justify-center text-sm font-bold`}>{cell}</div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Grid className="text-[#2b82c9]" /> Calculateur de Matrices
          </h2>
          <p className="text-sm text-slate-400">Configurez vos dimensions, générez des valeurs aléatoires et observez les résultats en temps réel.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              generateRandomMatrix(1, rows1, cols1);
              generateRandomMatrix(2, rows2, cols2);
            }}
            className="flex items-center gap-2 bg-[#2b82c9]/20 hover:bg-[#2b82c9]/30 text-sky-400 px-4 py-2 rounded-lg border border-sky-500/30 text-xs font-semibold transition-all"
          >
            <Sparkles size={14} /> Réinitialiser les deux matrices
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="bg-[#2b82c9] text-white py-3.5 px-6 font-bold text-center text-lg tracking-wide shadow-md">Matrice N°1</div>
          <div className="p-6 space-y-5">
            <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#2b82c9] mb-3">Saisie des dimensions</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nombre de lignes (1-6) :</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={rows1}
                    onChange={(e) => handleDimensionChange(1, 'rows', e.target.value)}
                    className="w-full bg-[#111827] text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2b82c9]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nombre de colonnes (1-6) :</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={cols1}
                    onChange={(e) => handleDimensionChange(1, 'cols', e.target.value)}
                    className="w-full bg-[#111827] text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2b82c9]"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => generateRandomMatrix(1, rows1, cols1)}
              className="w-full bg-[#2b82c9]/10 hover:bg-[#2b82c9]/20 text-sky-400 border border-sky-500/30 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={15} /> Générer des valeurs aléatoires
            </button>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Valeurs générées :</h4>
              <div className="bg-[#111827] p-5 rounded-lg border border-slate-800/80 min-h-[160px] flex items-center justify-center overflow-x-auto">
                {renderMatrixInputs(matrix1, 1, rows1, cols1, handleCellChange)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3.5 px-6 font-bold text-center text-lg tracking-wide shadow-md">Matrice N°2</div>
          <div className="p-6 space-y-5">
            <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-amber-500 mb-3">Saisie des dimensions</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nombre de lignes (1-6) :</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={rows2}
                    onChange={(e) => handleDimensionChange(2, 'rows', e.target.value)}
                    className="w-full bg-[#111827] text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Nombre de colonnes (1-6) :</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={cols2}
                    onChange={(e) => handleDimensionChange(2, 'cols', e.target.value)}
                    className="w-full bg-[#111827] text-white border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={() => generateRandomMatrix(2, rows2, cols2)}
              className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw size={15} /> Générer des valeurs aléatoires
            </button>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Valeurs générées :</h4>
              <div className="bg-[#111827] p-5 rounded-lg border border-slate-800/80 min-h-[160px] flex items-center justify-center overflow-x-auto">
                {renderMatrixInputs(matrix2, 2, rows2, cols2, handleCellChange)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
          <Calculator className="text-emerald-400 w-6 h-6" />
          <div>
            <h3 className="text-lg font-bold text-white">Résultats des Opérations</h3>
            <p className="text-xs text-slate-400">Calcul automatique en temps réel des principales opérations matricielles</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-sky-400 font-bold text-sm">
                <span>Addition (Matrice 1 + 2)</span>
                <Plus size={16} />
              </div>
              {additionResult.error ? (
                <div className="text-xs bg-red-950/40 text-red-300 border border-red-900/50 p-3 rounded-lg">{additionResult.error}</div>
              ) : renderResultGrid(additionResult.data, cols1, 'bg-sky-950/40 border border-sky-900/50 text-[#2b82c9]')}
            </div>
          </div>
          <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-amber-400 font-bold text-sm">
                <span>Soustraction (Matrice 1 - 2)</span>
                <Minus size={16} />
              </div>
              {subtractionResult.error ? (
                <div className="text-xs bg-red-950/40 text-red-300 border border-red-900/50 p-3 rounded-lg">{subtractionResult.error}</div>
              ) : renderResultGrid(subtractionResult.data, cols1, 'bg-amber-950/40 border border-amber-900/50 text-amber-500')}
            </div>
          </div>
          <div className="bg-[#1e293b]/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 text-emerald-400 font-bold text-sm">
                <span>Multiplication (Matrice 1 × 2)</span>
                <X size={16} />
              </div>
              {multiplicationResult.error ? (
                <div className="text-xs bg-red-950/40 text-red-300 border border-red-900/50 p-3 rounded-lg">{multiplicationResult.error}</div>
              ) : renderResultGrid(multiplicationResult.data, cols2, 'bg-emerald-950/40 border border-emerald-900/50 text-emerald-400')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function StudentCvUploadSection({ currentStudent, cvUploadMessage, handleCvUpload, cvUploading }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12 w-full">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="text-sky-400" /> Mon Curriculum Vitae
        </h2>
        <p className="text-sm text-slate-400">Téléchargez votre CV au format PDF pour votre profil étudiant.</p>
      </div>

      {!currentStudent ? (
        <div className="bg-slate-900/40 p-8 rounded-lg border border-slate-800 text-center">
          <p className="text-slate-400 text-sm">Veuillez vous connecter pour uploader votre CV.</p>
        </div>
      ) : (
        <div className="bg-[#1e293b]/80 border border-slate-700/80 rounded-xl p-6 shadow-xl backdrop-blur-sm">
          <div className="space-y-4">
            <div className="bg-slate-900/40 p-4 rounded-lg border border-slate-800">
              <p className="text-xs text-slate-300 mb-2"><span className="font-semibold text-sky-400">ℹ Code Étudiant :</span> {currentStudent.code}</p>
              <p className="text-xs text-slate-400">Votre CV sera associé à votre profil d'étudiant.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-3">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-12 h-12 border-2 border-dashed border-sky-500 rounded-lg flex items-center justify-center bg-sky-500/5 hover:bg-sky-500/10 transition-colors">
                    <Upload size={20} className="text-sky-400" />
                  </div>
                  <div>
                    <span className="text-white">Déposer votre CV ici</span>
                    <p className="text-xs text-slate-400 font-normal">ou cliquer pour parcourir (PDF, DOC, DOCX • Max 5MB)</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvUpload}
                  disabled={cvUploading}
                  className="hidden"
                />
              </label>
            </div>

            {cvUploadMessage && (
              <div className={`p-3 rounded-lg border ${
                cvUploadMessage.includes('avec succès') || cvUploadMessage.includes('succès')
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              }`}>
                <p className="text-xs font-medium">{cvUploadMessage}</p>
              </div>
            )}

            {cvUploading && (
              <div className="flex items-center gap-2 p-3 bg-slate-900/40 rounded-lg border border-slate-800">
                <div className="w-4 h-4 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin"></div>
                <p className="text-xs text-slate-300">Upload en cours...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminCvListSection({ students, handleDownloadCv, handleDeleteCv, cvDeleteLoading, searchTerm, setSearchTerm }) {
  const filteredStudents = students.filter(student =>
    `${student.prenom} ${student.nom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.code && student.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="text-sky-400" /> Gestion des CVs - Étudiants
          </h2>
          <p className="text-sm text-slate-400">
            Consultez et gérez les CVs téléchargés par les étudiants.
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Chercher nom, code, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1e293b] text-white border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-sky-400 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-[#1e293b]/50">
              <th className="text-left py-3 px-6 font-bold text-slate-300">Étudiant</th>
              <th className="text-left py-3 px-6 font-bold text-slate-300">Code</th>
              <th className="text-left py-3 px-6 font-bold text-slate-300">Email</th>
              <th className="text-center py-3 px-6 font-bold text-slate-300">CV</th>
              <th className="text-center py-3 px-6 font-bold text-slate-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 px-6 text-center text-slate-500 text-sm">
                  Aucun étudiant trouvé.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-slate-800 hover:bg-slate-900/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#131d31] border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400">
                        {student.prenom?.[0]}{student.nom?.[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{student.prenom} {student.nom}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs text-slate-400">{student.code || 'N/A'}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-sm">{student.email}</td>
                  <td className="py-4 px-6 text-center">
                    {student.cv_path ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                        <CheckCircle size={13} /> Présent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-slate-500/30 px-2.5 py-1 rounded-lg text-xs font-bold">
                        Aucun
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {student.cv_path ? (
                        <>
                          <button
                            onClick={() => handleDownloadCv(student.id)}
                            className="p-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-lg transition-colors"
                            title="Télécharger le CV"
                          >
                            <Download size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteCv(student.id)}
                            disabled={cvDeleteLoading[student.id]}
                            className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors disabled:opacity-50"
                            title="Supprimer le CV"
                          >
                            <Trash2 size={15} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500">-</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="text-xs text-slate-500 text-center py-4 border-t border-slate-800">
        Total : {filteredStudents.length} étudiant(s)
      </div>
    </div>
  );
}

export function SectionPlaceholder({ currentItem }) {
  return
}
