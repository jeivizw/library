import { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { supabase } from './supabase';

function App() {
  const [photoUrl, setPhotoUrl] = useState(null);
  const [nome, setNome] = useState('João Silva');
  const [matricula, setMatricula] = useState('123456789');
  const [curso, setCurso] = useState('Engenharia Informática');
  const [loading, setLoading] = useState(false);

  const handleCapture = async () => {
    try {
      setLoading(true);
      
      // 1. Captura da imagem local
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt
      });

      // 2. Conversão da URI para Blob (formato aceito pelo Supabase)
      const response = await fetch(image.webPath);
      const blob = await response.blob();
      const fileName = `${matricula}-${Date.now()}.jpeg`;

      // 3. Upload para o bucket 'user-photos'
      const { error: uploadError } = await supabase.storage
        .from('user-photos')
        .upload(fileName, blob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      // 4. Resgate da URL pública
      const { data } = supabase.storage
        .from('user-photos')
        .getPublicUrl(fileName);

      // 5. Renderização da URL na interface
      setPhotoUrl(data.publicUrl);
      alert('Foto salva na nuvem com sucesso!');

    } catch (error) {
      console.error('Erro na operação:', error);
      alert('Ação cancelada ou erro no upload. O aplicativo continua a funcionar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col md:flex-row gap-8 items-center justify-center font-sans">
      {/* Lado Esquerdo: Formulário */}
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Gerar Carteirinha</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input 
              type="text" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Matrícula (ID)</label>
            <input 
              type="text" 
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Curso</label>
            <input 
              type="text" 
              value={curso}
              onChange={(e) => setCurso(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 focus:ring-blue-500"
            />
          </div>
          
          <button 
            onClick={handleCapture}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-semibold mt-4 disabled:opacity-50"
          >
            {loading ? 'Enviando para a nuvem...' : 'Tirar Foto / Galeria'}
          </button>
        </div>
      </div>

      {/* Lado Direito: Pré-visualização da Carteirinha */}
      <div className="w-[350px] bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl shadow-2xl overflow-hidden border-2 border-white text-white">
        <div className="bg-white/10 p-4 border-b border-white/20 flex justify-between items-center">
          <span className="font-bold uppercase tracking-wider text-sm">Biblioteca Digital</span>
          <span className="text-xs bg-blue-500 px-2 py-1 rounded">Válido 2024</span>
        </div>
        
        <div className="p-6">
          <div className="flex gap-4">
            <div className="w-24 h-32 bg-gray-300 rounded-lg overflow-hidden border-2 border-white shrink-0 flex items-center justify-center text-gray-500 bg-white">
              {photoUrl ? (
                <img src={photoUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-center">Sem<br/>Foto</span>
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase leading-tight mb-1">{nome || 'NOME AQUI'}</h3>
              <p className="text-blue-200 text-sm font-medium mb-3">{curso || 'CURSO'}</p>
              <div>
                <span className="block text-[10px] uppercase text-blue-300">ID / Matrícula</span>
                <span className="font-mono">{matricula || '000000000'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white text-black p-3 text-center">
          <div className="barcode text-5xl mt-2 mb-1">*{matricula}*</div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Digitalização Obrigatória</p>
        </div>
      </div>
    </div>
  );
}

export default App;