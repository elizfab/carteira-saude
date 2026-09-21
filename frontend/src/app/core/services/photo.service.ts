import { Injectable } from '@angular/core';

const LARGURA_3X4 = 300;
const ALTURA_3X4 = 400;
const QUALIDADE_JPEG = 0.85;

@Injectable({ providedIn: 'root' })
export class PhotoService {
  /**
   * Lê um arquivo de imagem, corta/redimensiona (cover-fit) para 300x400px (proporção 3x4) e
   * retorna um data URL JPEG. Rejeita se o arquivo não puder ser lido como imagem.
   */
  processarArquivo(arquivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(arquivo);
      const imagem = new Image();

      imagem.onload = () => {
        try {
          resolve(this.redimensionar(imagem));
        } catch (erro) {
          reject(erro);
        } finally {
          URL.revokeObjectURL(url);
        }
      };

      imagem.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Não foi possível ler essa imagem.'));
      };

      imagem.src = url;
    });
  }

  private redimensionar(imagem: HTMLImageElement): string {
    const canvas = document.createElement('canvas');
    canvas.width = LARGURA_3X4;
    canvas.height = ALTURA_3X4;

    const contexto = canvas.getContext('2d');
    if (!contexto) {
      throw new Error('Não foi possível processar essa imagem.');
    }

    const escala = Math.max(LARGURA_3X4 / imagem.width, ALTURA_3X4 / imagem.height);
    const largura = imagem.width * escala;
    const altura = imagem.height * escala;
    contexto.drawImage(imagem, (LARGURA_3X4 - largura) / 2, (ALTURA_3X4 - altura) / 2, largura, altura);

    return canvas.toDataURL('image/jpeg', QUALIDADE_JPEG);
  }
}
