# Carteirinha Digital da Biblioteca

Aplicativo móvel desenvolvido com React e Capacitor para emissão de carteirinhas digitais. O sistema permite preencher os dados do utilizador, aceder à câmara nativa do dispositivo para capturar a foto de perfil e guardar a imagem automaticamente na nuvem.

## Funcionalidades
- **Formulário em Tempo Real:** Atualização imediata dos dados da carteirinha (Nome, Matrícula e Curso).
- **Câmara Nativa:** Integração com `@capacitor/camera` para captura de fotos no telemóvel ou navegador.
- **Armazenamento na Nuvem:** Upload automático da foto para um bucket público no Supabase Storage.
- **Código de Barras:** Renderização automática com base na matrícula do utilizador.
- **Integração Contínua (CI/CD):** Geração automatizada de instaladores Android (APK) através do GitHub Actions a cada envio para o ramo principal.

## Tecnologias Utilizadas
- **Frontend:** React, Vite, Tailwind CSS
- **Mobile/Nativo:** Capacitor
- **Backend/Storage:** Supabase
- **DevOps:** GitHub Actions

## Como Executar Localmente

**1. Clonar o repositório e instalar dependências**
```bash
git clone [https://github.com/SEU-USUARIO/library.git](https://github.com/SEU-USUARIO/library.git)
cd library
npm install
