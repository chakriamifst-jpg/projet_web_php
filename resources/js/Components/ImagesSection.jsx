import React from 'react';

export default function ImagesSection({ students, currentStudent, handleImageUpload, handleDownloadImage, handleDeleteImage, imageUploadMessage, imageUploading, isStudent }) {
  // If the logged user is a student, only show their own card; admins see all students
  const visibleStudents = isStudent ? students.filter((s) => currentStudent && s.id === currentStudent.id) : students;

  return (
    <div className="max-w-6xl mx-auto pb-12">
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {visibleStudents.map((student) => (
          <div key={student.id} className="bg-[#1e293b]/80 border border-slate-700 rounded-xl p-4 flex flex-col items-center text-center">
            <div className="w-36 h-36 bg-slate-900 rounded-md overflow-hidden flex items-center justify-center">
              {student.image_path ? (
                <img src={`/storage/${student.image_path}`} alt={`Image ${student.nom}`} className="w-full h-full object-cover" />
              ) : (
                <div className="text-xs text-slate-400">Aucune image</div>
              )}
            </div>

            <div className="mt-3 text-sm text-slate-300 font-medium">{student.nom} {student.prenom}</div>

            <div className="mt-3 w-full flex items-center gap-2">
              {student.image_path ? (
                <>
                  <button onClick={() => handleDownloadImage(student.id)} className="flex-1 bg-[#2b82c9]/10 hover:bg-[#2b82c9]/20 text-sky-400 px-3 py-2 rounded-md text-xs">Télécharger</button>
                  <button onClick={() => handleDeleteImage(student.id)} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-md text-xs">Supprimer</button>
                  {/* Students can replace their own image */}
                  {isStudent && currentStudent && currentStudent.id === student.id && (
                    <label className="ml-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 py-2 px-3 rounded-md cursor-pointer text-xs flex items-center gap-2">
                      {imageUploading ? 'Envoi...' : 'Remplacer'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(student.id, e)} />
                    </label>
                  )}
                </>
              ) : (
                <div className="w-full">
                  {/* allow student to upload only for their own card */}
                  {isStudent && currentStudent && currentStudent.id === student.id ? (
                    <label className="w-full flex items-center justify-center gap-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 py-2 rounded-md cursor-pointer text-xs">
                      {imageUploading ? 'Envoi...' : 'Choisir une image'}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(student.id, e)} />
                    </label>
                  ) : (
                    <div className="text-xs text-slate-500">Aucun fichier</div>
                  )}
                </div>
              )}
            </div>

            {imageUploadMessage && student.id === (currentStudent && currentStudent.id) && (
              <div className="mt-2 text-xs text-amber-300">{imageUploadMessage}</div>
            )}
          </div>
        ))}

        {/* If student has no own card (edge case), show friendly message */}
        {visibleStudents.length === 0 && (
          <div className="col-span-3 bg-[#141c2b]/80 border border-slate-800 rounded-xl p-6 text-center text-slate-400">Aucune image disponible pour votre compte.</div>
        )}
      </div>
    </div>
  );
}
