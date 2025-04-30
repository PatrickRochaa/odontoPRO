// Importa o helper NextResponse do Next.js para criar respostas HTTP
import { NextResponse } from "next/server";

// Importa a versão 2 da biblioteca Cloudinary (serviço de upload e gerenciamento de imagens)
import { v2 as cloudinary } from "cloudinary";

// Configura o Cloudinary com as variáveis de ambiente do projeto
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME as string, // Nome da conta Cloudinary
  api_key: process.env.CLOUDINARY_KEY as string, // Chave pública da API
  api_secret: process.env.CLOUDINARY_SECRET as string, // Chave secreta da API
});

// Define o handler POST para lidar com uploads de imagem
export const POST = async (request: Request) => {
  // Lê os dados do formulário enviados via multipart/form-data
  const formData = await request.formData();

  // Extrai o arquivo e o ID do usuário do formulário
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string;

  // Converte o arquivo em um ArrayBuffer e depois em um Uint8Array (necessário para o upload via stream)
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  // Validação: se o ID do usuário não existir ou estiver vazio, retorna erro de autenticação
  if (!userId || userId === "") {
    return NextResponse.json(
      { error: "Falha ao alterar imagem" },
      { status: 401 }
    );
  }

  // Validação: se o arquivo não for PNG ou JPEG, retorna erro de formato
  if (file.type !== "image/png" && file.type !== "image/jpeg") {
    return NextResponse.json(
      { error: "Formato de imagem invalido." },
      { status: 400 }
    );
  }

  // Realiza o upload da imagem para o Cloudinary usando stream
  const results = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          tags: [`${userId}`], // Adiciona uma tag com o ID do usuário à imagem
          public_id: file.name, // Define o nome da imagem com base no nome do arquivo
        },
        function (error, result) {
          // Callback após o upload
          if (error) {
            reject(error); // Se houver erro, rejeita a Promise
            return;
          }
          resolve(result); // Caso contrário, resolve com o resultado
        }
      )
      .end(buffer); // Envia o buffer de imagem no corpo da requisição
  });

  // Retorna o resultado do upload como resposta JSON
  return NextResponse.json(results);
};
