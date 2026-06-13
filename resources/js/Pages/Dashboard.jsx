import React, { useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import { Home, Grid, Image as ImageIcon, FileText, BarChart2, MapPin, UserPlus, Users, HelpCircle } from 'lucide-react';
import DashboardHeader from '../Components/DashboardHeader';
import DashboardSidebar from '../Components/DashboardSidebar';
import {
  HomeSection,
  GeolocationSection,
  QuizSection,
  StudentsTableSection,
  CvLibrarySection,
  AddStudentSection,
  MatricesSection,
  SectionPlaceholder,
  StudentLocationSection,
  StudentCvUploadSection,
  AdminCvListSection
} from '../Components/DashboardSections';
import { StudentCvModal, EditStudentModal, AdminProfileModal } from '../Components/DashboardModals';
import ImagesSection from '../Components/ImagesSection';

export default function App() {
  const menuItems = [
    { name: 'Accueil', icon: <Home size={18} />, key: 'Accueil' },
    { name: 'Matrices', icon: <Grid size={18} />, key: 'Matrices' },
    { name: 'Images', icon: <ImageIcon size={18} />, key: 'Images' },
    { name: 'Quiz', icon: <HelpCircle size={18} />, key: 'Quiz' },
    { name: 'Formulaire', icon: <FileText size={18} />, key: 'Formulaire' },
    { name: 'Statistiques', icon: <BarChart2 size={18} />, key: 'Statistiques' },
    { name: 'Géolocalisation', icon: <MapPin size={18} />, key: 'Géolocalisation', roles: ['admin'] },
    { name: 'Ma localisation', icon: <MapPin size={18} />, key: 'Ma localisation', roles: ['etudiant'] },
    { name: 'Mon CV', icon: <FileText size={18} />, key: 'Mon CV', roles: ['etudiant'] },
    { name: 'Ajouter étudiant', icon: <UserPlus size={18} />, key: 'Ajouter étudiant' },
    { name: 'CVs étudiants', icon: <Users size={18} />, key: 'CVs étudiants', roles: ['admin'] },
  ];

  const [activeTab, setActiveTab] = useState('Accueil');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const page = usePage();
  const authUser = page.props?.auth?.user || {};
  const role = authUser.role ?? 'admin';
  const isStudent = role === 'etudiant';
  const visibleMenuItems = menuItems.filter((item) => {
    if (item.roles) {
      return item.roles.includes(role);
    }
    return !(isStudent && ['Ajouter étudiant', 'Formulaire', 'CVs étudiants'].includes(item.key));
  });

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState('info');
  const [adminProfile, setAdminProfile] = useState({
    nom: authUser.name || 'Utilisateur',
    username: authUser.email ? authUser.email.split('@')[0] : 'user',
    email: authUser.email || 'admin.lestudy@uhp.ac.ma',
    telephone: '+212 6 00 11 22 33',
    role: role,
    avatarColor: '#2b82c9'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const [studentLocation, setStudentLocation] = useState({
    lat: '33.0028',
    lng: '-7.6201',
    ville: 'FST Settat'
  });
  const [locationMessage, setLocationMessage] = useState('');
  const [students, setStudents] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [adminSearchTerm, setAdminSearchTerm] = useState('');
  const [cvUploadMessage, setCvUploadMessage] = useState('');
  const [cvUploading, setCvUploading] = useState(false);
  const [imageUploadMessage, setImageUploadMessage] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [cvSearchTerm, setCvSearchTerm] = useState('');
  const [cvDeleteLoading, setCvDeleteLoading] = useState({});
  const [selectedStudentCv, setSelectedStudentCv] = useState(null);
  const [editingStudent, setEditingStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    nom: '', prenom: '', email: '', password: '', note1: '', note2: '', note3: '',
    lat: '33.0028', lng: '-7.6201', ville: 'FST Settat', hasCv: false, cvName: null,
    cvEmail: '', cvPhone: '', cvBio: '', cvSkills: []
  });

  const currentStudent = isStudent ? students.find((student) => student.cvEmail === authUser.email) : null;

  useEffect(() => {
    if (currentStudent) {
      setStudentLocation({
        lat: String(currentStudent.lat),
        lng: String(currentStudent.lng),
        ville: currentStudent.ville || 'FST Settat'
      });
    }
  }, [currentStudent]);

  const handleSubmitLocation = (e) => {
    e.preventDefault();
    if (!currentStudent) {
      setLocationMessage('Impossible de trouver votre profil étudiant pour enregistrer la localisation.');
      return;
    }

    const payload = {
      nom: currentStudent.nom || currentStudent.name || 'N/A',
      prenom: currentStudent.prenom || '',
      lat: parseFloat(studentLocation.lat) || null,
      lng: parseFloat(studentLocation.lng) || null,
      ville: studentLocation.ville || null,
    };

    (async () => {
      try {
        const res = await fetch(`/api/students/${currentStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setStudents((prev) => prev.map((student) => (
            student.id === currentStudent.id ? { ...student, lat: data.data.lat ?? student.lat, lng: data.data.lng ?? student.lng, ville: data.data.ville ?? student.ville } : student
          )));
          setLocationMessage('Votre localisation a bien été enregistrée en base. L’administration peut la consulter.');
          addLog(`PUT /api/students/${currentStudent.id} - Localisation enregistrée en BDD`);
        } else {
          console.error('Erreur API:', data);
          setLocationMessage(data.message || 'Erreur lors de l enregistrement de la localisation.');
        }
      } catch (err) {
        console.error('Erreur fetch:', err);
        setLocationMessage('Impossible de contacter le serveur pour enregistrer la localisation.');
      }
    })();
  };

  const [apiLogs, setApiLogs] = useState([]);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const mapRef = useRef(null);
  const leafletMarkersRef = useRef({});

  const addLog = (message) => {
    const time = new Date().toLocaleTimeString();
    setApiLogs((prev) => [`[${time}] ${message}`, ...prev.slice(0, 4)]);
  };

  const handleUpdateAdminProfile = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    addLog(`PUT /profile/data - Mise à jour du profil`);

    // get XSRF token from cookie
    const xsrf = (function() {
      const m = document.cookie.match(new RegExp('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)'));
      return m ? decodeURIComponent(m[2]) : null;
    })();

    try {
      const res = await fetch(route('profile.data.update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ name: adminProfile.nom, email: adminProfile.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setAdminProfile((prev) => ({ ...prev, nom: data.data.name, email: data.data.email }));
        setPasswordSuccess('Profil mis à jour avec succès.');
        setIsProfileOpen(false);
      } else {
        setPasswordError(data.message || 'Erreur lors de la mise à jour du profil.');
        console.error('Profile update error:', data);
      }
    } catch (err) {
      console.error('Network error updating profile:', err);
      setPasswordError('Impossible de contacter le serveur pour mettre à jour le profil.');
    }
  };

  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    addLog(`POST /profile/password - Changement de mot de passe`);

    const xsrf = (function() {
      const m = document.cookie.match(new RegExp('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)'));
      return m ? decodeURIComponent(m[2]) : null;
    })();

    try {
      const res = await fetch(route('profile.data.password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}),
        },
        credentials: 'same-origin',
        body: JSON.stringify({ current_password: passwordForm.currentPassword, new_password: passwordForm.newPassword, new_password_confirmation: passwordForm.confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordSuccess(data.message || 'Mot de passe mis à jour.');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setIsProfileOpen(false);
      } else {
        setPasswordError(data.message || 'Erreur lors du changement de mot de passe.');
        console.error('Password change error:', data);
      }
    } catch (err) {
      console.error('Network error changing password:', err);
      setPasswordError('Impossible de contacter le serveur pour changer le mot de passe.');
    }
  };

  useEffect(() => {
    if (isStudent && ['Ajouter étudiant', 'Formulaire', 'CVs étudiants'].includes(activeTab)) {
      setActiveTab('Accueil');
    }
  }, [activeTab, isStudent]);

  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const quizData = {
    react: {
      title: 'Quiz React.js',
      description: 'Mesurez vos aptitudes sur la gestion d\'état, le cycle de vie, les hooks de base et les performances de rendu.',
      questions: [
        {
          question: 'Quel hook React permet de mémoriser une fonction de callback pour éviter de la recréer inutilement à chaque rendu ?',
          options: ['useMemo', 'useCallback', 'useEffect', 'useRef'],
          answer: 1,
          explanation: 'useCallback mémorise l\'instance d\'une fonction elle-même, tandis que useMemo mémorise la valeur calculée par une fonction.'
        },
        {
          question: 'Dans quel ordre s\'exécutent les fonctions de nettoyage (cleanup) retournées par useEffect ?',
          options: ['Avant la prochaine exécution de l\'effet et lors du démontage du composant.', 'Uniquement lorsque l\'application entière redémarre.', 'Au tout début du premier rendu du composant.', 'De façon complètement asynchrone après le démontage.'],
          answer: 0,
          explanation: 'React exécute le nettoyage de l\'effet précédent avant de lancer l\'effet suivant, et également lors du démontage final du composant.'
        },
        {
          question: 'Laquelle de ces syntaxes est correcte pour déclarer un état local avec une valeur initiale de départ ?',
          options: ['const [state, setState] = useState(initialValue)', 'const state = useState(initialValue)', 'const {state, setState} = React.state(initialValue)', 'let [state, updateState] = new State(initialValue)'],
          answer: 0,
          explanation: 'useState retourne un tableau contenant l\'état actuel et une fonction de mise à jour, généralement destructuré sous la forme [state, setState].'
        },
        {
          question: 'Qu\'est-ce que la réconciliation (Reconciliation) dans l\'écosystème React ?',
          options: ['L\'algorithme de diffing qui compare l\'arbre du DOM Virtuel avec le DOM réel pour optimiser les mises à jour.', 'L\'importation de bibliothèques tierces dans node_modules.', 'La résolution de conflits Git lors du développement collaboratif.', 'Le processus de conversion automatique de React en HTML pur.'],
          answer: 0,
          explanation: 'La réconciliation est le processus par lequel React met à jour le DOM en comparant la nouvelle structure virtuelle à la précédente.'
        },
        {
          question: 'Quel Hook est recommandé pour consommer directement un Context global sans passer par un Consumer ?',
          options: ['useContext', 'useProvider', 'useGlobalState', 'useReducer'],
          answer: 0,
          explanation: 'useContext prend un objet de contexte (créé via React.createContext) et retourne la valeur actuelle de ce contexte.'
        }
      ]
    },
    nextjs: {
      title: 'Quiz Next.js',
      description: 'Évaluez votre niveau sur l\'App Router, les Server Components, la stratégie de caching et l\'optimisation SEO.',
      questions: [
        {
          question: 'Quelle directive doit obligatoirement être insérée en haut d\'un fichier dans Next.js pour l\'utiliser comme Client Component ?',
          options: ['"use client"', '"use server"', '"client-side"', '"import client"'],
          answer: 0,
          explanation: 'La directive "use client" indique à Next.js de traiter le composant et ses dépendances importées côté navigateur.'
        },
        {
          question: 'Dans le App Router, quel fichier spécial permet de capturer et d\'afficher les erreurs inattendues de sa route ?',
          options: ['error.js', 'layout.js', 'not-found.js', 'loading.js'],
          answer: 0,
          explanation: 'error.js crée automatiquement une Error Boundary React autour des routes enfants pour gérer élégamment les échecs.'
        },
        {
          question: 'De quelle manière Next.js gère-t-il par défaut le caching des requêtes fetch() dans les Server Components ?',
          options: ['Il met automatiquement en cache les réponses indéfiniment (Rendu Statique par défaut).', 'Il désactive systématiquement tout cache.', 'Il stocke les requêtes uniquement dans le LocalStorage du client.', 'Il demande au serveur de reconstruire la page toutes les secondes.'],
          answer: 0,
          explanation: 'Par défaut, Next.js met automatiquement en cache les requêtes de données fetch() côté serveur pour des gains de performance importants.'
        },
        {
          question: 'Quelle stratégie de rendu de Next.js permet de mettre à jour des pages statiques individuelles sans reconstruire tout le site web ?',
          options: ['Incremental Static Regeneration (ISR)', 'Static Site Generation (SSG)', 'Server-Side Rendering (SSR)', 'Client-Side Rendering (CSR)'],
          answer: 0,
          explanation: 'L\'ISR permet de régénérer de manière incrémentale des pages statiques en arrière-plan pendant que les utilisateurs continuent de naviguer.'
        },
        {
          question: 'Quel outil natif Next.js propose-t-il pour optimiser automatiquement le chargement et le poids des polices de caractères de tiers ?',
          options: ['next/font', 'next/style', 'next/typography', 'next/google-fonts'],
          answer: 0,
          explanation: 'Le module next/font télécharge et héberge automatiquement vos polices (comme Google Fonts) de façon statique lors du build pour éviter tout appel réseau externe.'
        }
      ]
    }
  };

  const startQuiz = (quizType) => {
    setSelectedQuiz(quizType);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setIsAnswered(false);
    addLog(`GET /api/quiz/${quizType} - Récupération du questionnaire depuis phpMyAdmin via Laravel API`);
  };

  const handleAnswerSelect = (index) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
  };

  const validateAnswer = () => {
    if (selectedAnswer === null || isAnswered) return;

    const isCorrect = selectedAnswer === quizData[selectedQuiz].questions[currentQuestionIndex].answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setIsAnswered(true);
  };

  const goToNextQuestion = () => {
    const totalQs = quizData[selectedQuiz].questions.length;
    if (currentQuestionIndex + 1 < totalQs) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      addLog(`POST /api/quiz-results - Score final enregistré : ${(score / totalQs) * 20}/20 dans phpMyAdmin`);
    }
  };

  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletLoaded(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletLoaded || activeTab !== 'Géolocalisation' || !window.L) return;

    const fstCoordinates = [33.0028, -7.6201];

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = window.L.map('map-container').setView(fstCoordinates, 15);
    mapRef.current = map;

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    const fstIcon = window.L.divIcon({
      className: 'custom-fst-marker',
      html: `<div class="w-8 h-8 rounded-full bg-[#2b82c9] border-4 border-white flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-pulse"><span class="text-white text-xs font-bold">FST</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    window.L.marker(fstCoordinates, { icon: fstIcon }).addTo(map).bindPopup("<b class='text-slate-900'>FST Settat</b><br/><span class='text-xs text-slate-500'>Point central de l'établissement</span>");

    const markers = {};
    students.forEach((student) => {
      const moyenne = calculateMoyenne(student.note1, student.note2, student.note3);
      const isRed = parseFloat(moyenne) < 10;

      const studentIcon = window.L.divIcon({
        className: 'custom-student-marker',
        html: `
          <div class="relative group">
            <div class="w-10 h-10 rounded-full border-2 ${isRed ? 'border-rose-500 bg-rose-950/90' : 'border-emerald-500 bg-emerald-950/90'} flex flex-col items-center justify-center shadow-md transform -translate-x-1/2 -translate-y-full transition-all hover:scale-110">
              <span class="text-[10px] font-bold text-slate-100">${student.prenom[0]}${student.nom[0]}</span>
              <span class="text-[9px] font-semibold text-sky-400 mt-[-2px]">${moyenne}</span>
            </div>
            <div class="w-3 h-3 ${isRed ? 'bg-rose-500' : 'bg-emerald-500'} rounded-full absolute -bottom-1 left-1/2 transform -translate-x-1/2 border border-slate-900"></div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40]
      });

      const popupContent = `
        <div class="p-2 text-slate-900 font-sans" style="min-width: 180px">
          <div class="flex items-center gap-2 border-b border-slate-200 pb-2 mb-2">
            <div class="w-8 h-8 rounded-full bg-[#2b82c9] text-white flex items-center justify-center font-bold text-xs">
              ${student.prenom[0]}${student.nom[0]}
            </div>
            <div>
              <h4 class="font-bold text-sm text-slate-800">${student.prenom} ${student.nom}</h4>
              <p class="text-[10px] text-slate-500 font-mono">${student.code}</p>
            </div>
          </div>
          <p class="text-xs text-slate-600 mb-1"><b>Secteur :</b> ${student.ville || 'Settat'}</p>
          <div class="grid grid-cols-3 gap-1 text-center bg-slate-100 p-1.5 rounded text-[10px] font-medium text-slate-700 mb-2">
            <div>N1: ${student.note1}</div>
            <div>N2: ${student.note2}</div>
            <div>N3: ${student.note3}</div>
          </div>
          <div class="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
            <span class="text-slate-500 font-semibold">Moyenne :</span>
            <span class="font-bold text-sm ${parseFloat(moyenne) < 10 ? 'text-rose-600' : 'text-emerald-600'}">${moyenne}/20</span>
          </div>
        </div>
      `;

      const marker = window.L.marker([student.lat, student.lng], { icon: studentIcon })
        .addTo(map)
        .bindPopup(popupContent);

      markers[student.id] = marker;
    });

    leafletMarkersRef.current = markers;
  }, [leafletLoaded, activeTab, students]);

  // Récupérer les étudiants depuis la base de données
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students', { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' });
        let data;
        try {
          data = await response.json();
        } catch (err) {
          console.error('Invalid JSON from /api/students:', err);
          const text = await response.text();
          console.error('Response body:', text);
          addLog(`GET /api/students - Invalid response (status ${response.status})`);
          return;
        }

        if (response.ok && data.success && data.data && data.data.length > 0) {
          // Mapper les données de l'API aux données du frontend
          const dbStudents = data.data.map((student) => ({
            id: student.id,
            code: student.code || 'N/A',
            nom: student.nom || 'Inconnu',
            prenom: student.prenom || '',
            email: student.email,
            note1: student.note1 || 0,
            note2: student.note2 || 0,
            note3: student.note3 || 0,
            lat: student.lat || 33.0028,
            lng: student.lng || -7.6201,
            ville: student.ville || 'FST Settat',

            hasCv: student.hasCv ? true :  false,
            cvName: student.cv_path ? student.cv_path.split('/').pop() : null,
            cv_path: student.cv_path || null,
            image_path: student.image_path || null,
            cvEmail: student.email,
            cvPhone: '+212 6 00 00 00 00',
            cvBio: 'Étudiant inscrit à la FST Settat',
            cvSkills: ['Étudie', 'Travaille dur']
          }));

          setStudents(dbStudents);
          addLog(`GET /api/students - ${dbStudents.length} étudiant(s) chargé(s) depuis phpMyAdmin`);

          // Immediately try to fetch image metadata and merge (ensures images persist after refresh)
          (async () => {
            try {
              const resImgs = await fetch('/api/students/images');
              const imgs = await resImgs.json();
              if (imgs.success && Array.isArray(imgs.data)) {
                setStudents((prev) => {
                  const map = {};
                  prev.forEach((s) => { map[s.id] = { ...s }; });
                  imgs.data.forEach((s) => {
                    if (map[s.id]) {
                      map[s.id] = { ...map[s.id], image_path: s.image_path, image_uploaded_at: s.image_uploaded_at, nom: s.nom ?? map[s.id].nom, prenom: s.prenom ?? map[s.id].prenom };
                    } else {
                      map[s.id] = {
                        id: s.id,
                        code: 'N/A',
                        nom: s.nom || 'Inconnu',
                        prenom: s.prenom || '',
                        email: s.email || null,
                        note1: 0,
                        note2: 0,
                        note3: 0,
                        lat: 33.0028,
                        lng: -7.6201,
                        ville: 'FST Settat',
                        hasCv: false,
                        cvName: null,
                        cvEmail: s.email || null,
                        cvPhone: '',
                        cvBio: '',
                        cvSkills: [],
                        image_path: s.image_path,
                        image_uploaded_at: s.image_uploaded_at,
                      };
                    }
                  });
                  return Object.values(map);
                });
                addLog(`Merged ${imgs.data.length} image(s) depuis /api/students/images`);
              }
            } catch (err) {
              console.error('Erreur merging images:', err);
            }
          })();
        } else {
          addLog(`GET /api/students - Aucun étudiant trouvé, utilisation des données par défaut`);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des étudiants:', error);
        addLog(`GET /api/students - Erreur: ${error.message}`);
      }
    };

    // Charger les étudiants au montage du composant
    fetchStudents();
  }, []);

  // Quand on affiche l'onglet Images, récupérer la liste d'images (route dédiée)
  useEffect(() => {
    if (activeTab !== 'Images') return;

    const fetchImages = async () => {
      try {
        const res = await fetch('/api/students/images', { headers: { 'X-Requested-With': 'XMLHttpRequest' }, credentials: 'same-origin' });
        if (!res.ok) {
          const text = await res.text();
          console.error('/api/students/images returned', res.status, text);
          addLog(`GET /api/students/images - status ${res.status}`);
          return;
        }
        const data = await res.json();
        if (data.success && data.data) {
          // data.data: [{id, nom, prenom, email, image_path, image_uploaded_at}, ...]
          setStudents((prev) => {
            const map = {};
            prev.forEach((s) => { map[s.id] = s; });
            data.data.forEach((s) => {
              if (map[s.id]) {
                map[s.id] = { ...map[s.id], image_path: s.image_path, image_uploaded_at: s.image_uploaded_at, nom: s.nom, prenom: s.prenom, email: s.email };
              } else {
                map[s.id] = {
                  id: s.id,
                  code: 'N/A',
                  nom: s.nom || 'Inconnu',
                  prenom: s.prenom || '',
                  email: s.email || null,
                  note1: 0,
                  note2: 0,
                  note3: 0,
                  lat: 33.0028,
                  lng: -7.6201,
                  ville: 'FST Settat',
                  hasCv: false,
                  cvName: null,
                  cvEmail: s.email || null,
                  cvPhone: '',
                  cvBio: '',
                  cvSkills: [],
                  image_path: s.image_path,
                  image_uploaded_at: s.image_uploaded_at,
                };
              }
            });
            return Object.values(map);
          });
          addLog(`GET /api/students/images - ${data.data.length} images chargées`);
        }
      } catch (err) {
        console.error('Erreur récupération images:', err);
        addLog(`GET /api/students/images - Erreur: ${err.message}`);
      }
    };

    fetchImages();
  }, [activeTab]);

  const focusOnStudent = (student) => {
    if (mapRef.current && window.L) {
      mapRef.current.flyTo([student.lat, student.lng], 17, {
        animate: true,
        duration: 1.5
      });

      setTimeout(() => {
        const marker = leafletMarkersRef.current[student.id];
        if (marker) {
          marker.openPopup();
        }
      }, 1500);
    }
  };

  const handleUpdateStudent = (e) => {
    e.preventDefault();
    const payload = {
      nom: editingStudent.nom,
      prenom: editingStudent.prenom,
      note1: editingStudent.note1,
      note2: editingStudent.note2,
      note3: editingStudent.note3,
      lat: editingStudent.lat,
      lng: editingStudent.lng,
      ville: editingStudent.ville,
    };

    (async () => {
      try {
        const res = await fetch(`/api/students/${editingStudent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // Mettre à jour l'état local avec la réponse
          setStudents((prev) => prev.map((stud) => (stud.id === editingStudent.id ? { ...stud, ...data.data } : stud)));
          addLog(`PUT /api/students/${editingStudent.id} - Mises à jour persistées en BDD`);
          setEditingStudent(null);
        } else {
          console.error('Erreur API:', data);
          alert(data.message || 'Erreur lors de la mise à jour de l\'étudiant');
        }
      } catch (err) {
        console.error('Erreur fetch:', err);
        alert('Impossible de contacter le serveur.');
      }
    })();
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.nom || !newStudent.prenom || !newStudent.email || !newStudent.password) {
      alert('Veuillez remplir : nom, prénom, email et mot de passe.');
      return;
    }

    const payload = {
      nom: newStudent.nom,
      prenom: newStudent.prenom,
      email: newStudent.email,
      password: newStudent.password,
      note1: newStudent.note1 ? parseFloat(newStudent.note1) : null,
      note2: newStudent.note2 ? parseFloat(newStudent.note2) : null,
      note3: newStudent.note3 ? parseFloat(newStudent.note3) : null,
      lat: parseFloat(newStudent.lat) || 33.0028,
      lng: parseFloat(newStudent.lng) || -7.6201,
      ville: newStudent.ville || 'FST Settat',
    };

    (async () => {
      try {
        const res = await fetch('/api/students', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          // Ajouter l'étudiant à la liste
          const newStudentData = {
            id: data.data.id,
            code: data.data.code,
            nom: data.data.nom,
            prenom: data.data.prenom,
            email: data.data.email,
            note1: data.data.note1 || 0,
            note2: data.data.note2 || 0,
            note3: data.data.note3 || 0,
            lat: data.data.lat,
            lng: data.data.lng,
            ville: data.data.ville,
            hasCv: false,
            cvName: null,
            cvEmail: data.data.email,
            cvPhone: '+212 6 00 00 00 00',
            cvBio: 'Nouvel étudiant inscrit à la FST Settat.',
            cvSkills: ['Généraliste']
          };

          setStudents((prev) => [...prev, newStudentData]);
          addLog(`POST /api/students - Nouvel étudiant ${newStudentData.nom} créé avec compte fonctionnel en BDD`);

          // Réinitialiser le formulaire
          setNewStudent({
            nom: '', prenom: '', email: '', password: '', note1: '', note2: '', note3: '',
            lat: '33.0028', lng: '-7.6201', ville: 'FST Settat', hasCv: false, cvName: null,
            cvEmail: '', cvPhone: '', cvBio: '', cvSkills: []
          });

          setActiveTab('Formulaire');
        } else {
          console.error('Erreur API:', data);
          alert(data.message || 'Erreur lors de la création de l\'étudiant');
        }
      } catch (err) {
        console.error('Erreur fetch:', err);
        alert('Impossible de contacter le serveur.');
      }
    })();
  };

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((stud) => stud.id !== id));
    addLog(`DELETE /api/students/${id} - Suppression physique de l'étudiant dans phpMyAdmin`);
  };

  const handleSimulatedCvUpload = (studentId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setStudents((prev) => prev.map((stud) => {
      if (stud.id === studentId) {
        return { ...stud, hasCv: true, cvName: file.name };
      }
      return stud;
    }));

    addLog(`POST /api/students/${studentId}/upload-cv - Fichier '${file.name}' stocké dans storage/ et enregistré dans phpMyAdmin`);
  };

  const handleImageUpload = async (studentId, e) => {
  const file = e.target.files?.[0];
  if (!file) {
    setImageUploadMessage('Aucun fichier sélectionné.');
    return;
  }

  const nameOnly = file.name.split('.').slice(0, -1).join('.') || file.name;
  if (nameOnly.length > 20) {
    setImageUploadMessage('Le nom du fichier (sans extension) dépasse 20 caractères.');
    return;
  }

  if (!['image/jpeg','image/png','image/jpg','image/gif','image/webp'].includes(file.type)) {
    setImageUploadMessage('Format non valide. Acceptés: jpeg, png, gif, webp');
    return;
  }

  if (file.size > 5120000) {
    setImageUploadMessage('Fichier trop volumineux (max 5MB)');
    return;
  }

  setImageUploading(true);
  setImageUploadMessage('');
  const formData = new FormData();
  formData.append('image', file);

  // XSRF token from cookie (Laravel expects X-XSRF-TOKEN header when using fetch)
  const xsrf = (function() {
    const m = document.cookie.match(new RegExp('(^|;)\\s*XSRF-TOKEN\\s*=\\s*([^;]+)'));
    return m ? decodeURIComponent(m[2]) : null;
  })();

  try {
    const res = await fetch(`/api/students/${studentId}/image`, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest', ...(xsrf ? { 'X-XSRF-TOKEN': xsrf } : {}) },
      credentials: 'same-origin',
      body: formData,
    });

    if (res.status === 419) {
      setImageUploadMessage('Session expirée ou token CSRF manquant. Rechargez la page et reconnectez-vous.');
      return;
    }

    const data = await res.json();
    if (res.ok && data.success) {
      setImageUploadMessage('✓ Image uploadée avec succès!');
      setStudents((prev) => prev.map((student) => (
        student.id === studentId ? { ...student, image_path: data.data.image_path } : student
      )));
      addLog(`POST /api/students/${studentId}/image - Image uploadée`);
      // clear file input (try to find input and reset)
      try { e.target.value = ''; } catch (err) {}
    } else {
      setImageUploadMessage(data.message || 'Erreur lors de l\'upload de l\'image.');
    }
  } catch (err) {
    setImageUploadMessage('Erreur de connexion lors de l\'upload de l\'image.');
    console.error(err);
  } finally {
    setImageUploading(false);
  }
  };

  const handleSimulatedCvDelete = (studentId) => {
    setStudents((prev) => prev.map((stud) => {
      if (stud.id === studentId) {
        return { ...stud, hasCv: false, cvName: null };
      }
      return stud;
    }));
    addLog(`DELETE /api/students/${studentId}/delete-cv - Fichier supprimé du stockage Laravel & table phpMyAdmin mise à jour`);
  };

  const handleSimulatedCvDownload = (student) => {
    addLog(`GET /api/students/${student.id}/download-cv - Requête de téléchargement du fichier storage/cvs/${student.cvName}`);

    const alertModal = document.createElement('div');
    alertModal.className = 'fixed bottom-5 left-5 bg-emerald-600 text-white py-3 px-5 rounded-lg shadow-2xl z-[999] flex items-center gap-2 transition-opacity duration-500';
    alertModal.innerHTML = `<span>Téléchargement de <b>${student.cvName}</b> lancé !</span>`;
    document.body.appendChild(alertModal);
    setTimeout(() => {
      alertModal.style.opacity = '0';
      setTimeout(() => alertModal.remove(), 500);
    }, 3000);
  };

  const handleCvUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !currentStudent) {
      setCvUploadMessage('Erreur: fichier non sélectionné ou profil non trouvé.');
      return;
    }

    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
      setCvUploadMessage('Format non valide. Acceptés: PDF, DOC, DOCX');
      return;
    }

    if (file.size > 5120000) {
      setCvUploadMessage('Fichier trop volumineux (max 5MB)');
      return;
    }

    setCvUploading(true);
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const res = await fetch(`/api/students/${currentStudent.id}/cv`, {
        method: 'POST',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCvUploadMessage('✓ Votre CV a été uploadé avec succès!');
        setStudents((prev) => prev.map((student) => (
          student.id === currentStudent.id ? { ...student, cv_path: data.data.cv_path, hasCv: true, cvName: data.data.cv_path.split('/').pop() } : student
        )));
        addLog(`POST /api/students/${currentStudent.id}/cv - CV uploadé avec succès`);
      } else {
        setCvUploadMessage(data.message || 'Erreur lors de l\'upload du CV.');
      }
    } catch (err) {
      setCvUploadMessage('Erreur de connexion lors de l\'upload du CV.');
      console.error(err);
    } finally {
      setCvUploading(false);
    }
  };

  const handleDownloadImage = (studentId) => {
    window.location.href = `/api/students/${studentId}/image`;
    addLog(`GET /api/students/${studentId}/image - Téléchargement de l'image`);
  };

  const handleDeleteImage = async (studentId) => {
    try {
      const res = await fetch(`/api/students/${studentId}/image`, { method: 'DELETE', headers: { 'X-Requested-With': 'XMLHttpRequest' } });
      const data = await res.json();
      if (res.ok && data.success) {
        setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, image_path: null } : s)));
        addLog(`DELETE /api/students/${studentId}/image - Image supprimée`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadCv = (studentId) => {
    window.location.href = `/api/students/${studentId}/cv`;
    addLog(`GET /api/students/${studentId}/cv - Téléchargement du CV`);
  };

  const handleDeleteCv = async (studentId) => {
    setCvDeleteLoading((prev) => ({ ...prev, [studentId]: true }));
    try {
      const res = await fetch(`/api/students/${studentId}/cv`, {
        method: 'DELETE',
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStudents((prev) => prev.map((student) => (
          student.id === studentId ? { ...student, cv_path: null } : student
        )));
        addLog(`DELETE /api/students/${studentId}/cv - CV supprimé`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCvDeleteLoading((prev) => ({ ...prev, [studentId]: false }));
    }
  };

  const [rows1, setRows1] = useState(3);
  const [cols1, setCols1] = useState(3);
  const [matrix1, setMatrix1] = useState([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
  const [rows2, setRows2] = useState(3);
  const [cols2, setCols2] = useState(3);
  const [matrix2, setMatrix2] = useState([[9, 8, 7], [6, 5, 4], [3, 2, 1]]);

  const calculateMoyenne = (n1, n2, n3) => {
    const average = (parseFloat(n1) + parseFloat(n2) + parseFloat(n3)) / 3;
    return isNaN(average) ? '0.00' : average.toFixed(2);
  };

  const generateRandomMatrix = (matrixNum, r, c) => {
    const rowsNum = parseInt(r) || 2;
    const colsNum = parseInt(c) || 2;
    const newMatrix = Array.from({ length: rowsNum }, () =>
      Array.from({ length: colsNum }, () => Math.floor(Math.random() * 19) - 9)
    );

    if (matrixNum === 1) setMatrix1(newMatrix);
    else setMatrix2(newMatrix);
  };

  const handleCellChange = (matrixNum, rIdx, cIdx, val) => {
    const numVal = parseInt(val) || 0;
    if (matrixNum === 1) {
      setMatrix1(matrix1.map((row, ri) => row.map((cell, ci) => (ri === rIdx && ci === cIdx ? numVal : cell))));
    } else {
      setMatrix2(matrix2.map((row, ri) => row.map((cell, ci) => (ri === rIdx && ci === cIdx ? numVal : cell))));
    }
  };

  const handleDimensionChange = (matrixNum, type, value) => {
    const num = Math.max(1, Math.min(6, parseInt(value) || 1));
    if (matrixNum === 1) {
      if (type === 'rows') {
        setRows1(num);
        setMatrix1((prev) => {
          let updated = [...prev];
          while (updated.length < num) updated.push(new Array(cols1).fill(0));
          return updated.slice(0, num);
        });
      } else {
        setCols1(num);
        setMatrix1((prev) => prev.map((row) => {
          let updatedRow = [...row];
          while (updatedRow.length < num) updatedRow.push(0);
          return updatedRow.slice(0, num);
        }));
      }
    } else {
      if (type === 'rows') {
        setRows2(num);
        setMatrix2((prev) => {
          let updated = [...prev];
          while (updated.length < num) updated.push(new Array(cols2).fill(0));
          return updated.slice(0, num);
        });
      } else {
        setCols2(num);
        setMatrix2((prev) => prev.map((row) => {
          let updatedRow = [...row];
          while (updatedRow.length < num) updatedRow.push(0);
          return updatedRow.slice(0, num);
        }));
      }
    }
  };

  const addMatrices = () => {
    if (rows1 !== rows2 || cols1 !== cols2) return { error: "L'addition nécessite des matrices de mêmes dimensions." };
    return { data: matrix1.map((row, rIdx) => row.map((val, cIdx) => val + matrix2[rIdx][cIdx])) };
  };

  const subtractMatrices = () => {
    if (rows1 !== rows2 || cols1 !== cols2) return { error: "La soustraction nécessite des matrices de mêmes dimensions." };
    return { data: matrix1.map((row, rIdx) => row.map((val, cIdx) => val - matrix2[rIdx][cIdx])) };
  };

  const multiplyMatrices = () => {
    if (cols1 !== rows2) return { error: "Multiplication impossible : Colonnes M1 doivent égaler Lignes M2." };
    const result = Array.from({ length: rows1 }, () => Array(cols2).fill(0));
    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols2; j++) {
        let sum = 0;
        for (let k = 0; k < cols1; k++) sum += matrix1[i][k] * matrix2[k][j];
        result[i][j] = sum;
      }
    }
    return { data: result };
  };

  const additionResult = addMatrices();
  const subtractionResult = subtractMatrices();
  const multiplicationResult = multiplyMatrices();

  const currentItem = menuItems.find((item) => item.key === activeTab);

  const filteredStudents = students.filter((student) => {
    const searchString = `${student.nom} ${student.prenom} ${student.code}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  const filteredAdminStudents = students.filter((student) => {
    const searchString = `${student.nom} ${student.prenom} ${student.code}`.toLowerCase();
    return searchString.includes(adminSearchTerm.toLowerCase());
  });

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-100 font-sans overflow-hidden">
      <div className={`flex-1 flex flex-col transition-all duration-300 relative ${isSidebarOpen ? 'mr-64' : 'mr-0'}`}>
        <DashboardHeader currentItem={currentItem} />
        <main className="flex-1 relative overflow-y-auto bg-gradient-to-br from-[#0f172a] via-[#151b3a] to-[#1e1b4b] p-6 lg:p-8 flex flex-col">
          {activeTab === 'Accueil' && <HomeSection setActiveTab={setActiveTab} isStudent={isStudent} />}
          {activeTab === 'Images' && (
            <ImagesSection
              students={students}
              currentStudent={currentStudent}
              handleImageUpload={handleImageUpload}
              handleDownloadImage={handleDownloadImage}
              handleDeleteImage={handleDeleteImage}
              imageUploadMessage={imageUploadMessage}
              imageUploading={imageUploading}
              isStudent={isStudent}
            />
          )}
          {activeTab === 'Géolocalisation' && (
            <GeolocationSection
              students={students}
              calculateMoyenne={calculateMoyenne}
              leafletLoaded={leafletLoaded}
              focusOnStudent={focusOnStudent}
            />
          )}
          {activeTab === 'Quiz' && (
            <QuizSection
              selectedQuiz={selectedQuiz}
              setSelectedQuiz={setSelectedQuiz}
              quizData={quizData}
              currentQuestionIndex={currentQuestionIndex}
              score={score}
              quizFinished={quizFinished}
              selectedAnswer={selectedAnswer}
              isAnswered={isAnswered}
              startQuiz={startQuiz}
              handleAnswerSelect={handleAnswerSelect}
              validateAnswer={validateAnswer}
              goToNextQuestion={goToNextQuestion}
              apiLogs={apiLogs}
            />
          )}
          {activeTab === 'Formulaire' && (
            <StudentsTableSection
              students={filteredAdminStudents}
              calculateMoyenne={calculateMoyenne}
              setEditingStudent={setEditingStudent}
              handleDeleteStudent={handleDeleteStudent}
              apiLogs={apiLogs}
              searchTerm={adminSearchTerm}
              setSearchTerm={setAdminSearchTerm}
            />
          )}
          {activeTab === 'Ma localisation' && (
            <StudentLocationSection
              currentStudent={currentStudent}
              studentLocation={studentLocation}
              setStudentLocation={setStudentLocation}
              handleSubmitLocation={handleSubmitLocation}
              locationMessage={locationMessage}
            />
          )}
          {activeTab === 'Mon CV' && (
            <StudentCvUploadSection
              currentStudent={currentStudent}
              cvUploadMessage={cvUploadMessage}
              handleCvUpload={handleCvUpload}
              cvUploading={cvUploading}
            />
          )}
          {activeTab === 'CVs étudiants' && (
            <CvLibrarySection
              filteredStudents={filteredStudents}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleSimulatedCvUpload={handleSimulatedCvUpload}
              handleSimulatedCvDownload={handleSimulatedCvDownload}
              handleSimulatedCvDelete={handleSimulatedCvDelete}
              setSelectedStudentCv={setSelectedStudentCv}
              apiLogs={apiLogs}
            />
          )}
          {activeTab === 'CVs étudiants' && (
            <AdminCvListSection
              students={students}
              handleDownloadCv={handleDownloadCv}
              handleDeleteCv={handleDeleteCv}
              cvDeleteLoading={cvDeleteLoading}
              searchTerm={cvSearchTerm}
              setSearchTerm={setCvSearchTerm}
            />
          )}
          {activeTab === 'Ajouter étudiant' && (
            <AddStudentSection
              newStudent={newStudent}
              setNewStudent={setNewStudent}
              handleAddStudent={handleAddStudent}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === 'Matrices' && (
            <MatricesSection
              rows1={rows1}
              cols1={cols1}
              matrix1={matrix1}
              rows2={rows2}
              cols2={cols2}
              matrix2={matrix2}
              generateRandomMatrix={generateRandomMatrix}
              handleDimensionChange={handleDimensionChange}
              handleCellChange={handleCellChange}
              additionResult={additionResult}
              subtractionResult={subtractionResult}
              multiplicationResult={multiplicationResult}
            />
          )}
          {!['Accueil', 'Matrices', 'Formulaire', 'Ajouter étudiant', 'Géolocalisation', 'CVs étudiants', 'Quiz'].includes(activeTab) && (
            <SectionPlaceholder currentItem={currentItem} />
          )}
        </main>
      </div>

      {selectedStudentCv && (
        <StudentCvModal
          selectedStudentCv={selectedStudentCv}
          handleSimulatedCvDownload={handleSimulatedCvDownload}
          setSelectedStudentCv={setSelectedStudentCv}
          calculateMoyenne={calculateMoyenne}
        />
      )}

      {editingStudent && (
        <EditStudentModal
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
          handleUpdateStudent={handleUpdateStudent}
          calculateMoyenne={calculateMoyenne}
        />
      )}

      {isProfileOpen && (
        <AdminProfileModal
          adminProfile={adminProfile}
          setAdminProfile={setAdminProfile}
          activeProfileTab={activeProfileTab}
          setActiveProfileTab={setActiveProfileTab}
          passwordForm={passwordForm}
          passwordError={passwordError}
          passwordSuccess={passwordSuccess}
          handleUpdateAdminProfile={handleUpdateAdminProfile}
          handleChangeAdminPassword={handleChangeAdminPassword}
          setPasswordForm={setPasswordForm}
          setIsProfileOpen={setIsProfileOpen}
        />
      )}

      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        adminProfile={adminProfile}
        setIsProfileOpen={setIsProfileOpen}
        setActiveProfileTab={setActiveProfileTab}
        menuItems={visibleMenuItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
