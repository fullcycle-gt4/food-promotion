import cafeArabica from './imagens-produtos/cafe-gourmet-arabica.jpg';
import azeiteOliva from './imagens-produtos/azeite-de-oliva.jpg';
import chocolatePreto from './imagens-produtos/chocolate-preto.jpg';
import arrozIntegral from './imagens-produtos/arroz-integral.jpg';
import aveiaFlocos from './imagens-produtos/fia-de-aveia.jpg';
import chaVerde from './imagens-produtos/cha-verde.jpg';

export const mockProdutos = [
  {
    id: 1,
    nome: 'Café Gourmet Arábica 500g',
    preco: '34.90',
    quantidade: '25',
    dataVencimento: '2026-11-15',
    imagem: cafeArabica
  },
  {
    id: 2,
    nome: 'Azeite de Oliva Extra Virgem 500ml',
    preco: '49.90',
    quantidade: '10',
    dataVencimento: '2027-06-30',
    imagem: azeiteOliva
  },
  {
    id: 3,
    nome: 'Chocolate Preto 70% Cacau 100g',
    preco: '9.99',
    quantidade: '50',
    dataVencimento: '2026-08-20',
    imagem: chocolatePreto
  },
  {
    id: 4,
    nome: 'Arroz Integral 1kg',
    preco: '7.50',
    quantidade: '40',
    dataVencimento: '2027-02-10',
    imagem: arrozIntegral
  },
  {
    id: 5,
    nome: 'Fia de Aveia em Flocos 250g',
    preco: '6.20',
    quantidade: '30',
    dataVencimento: '2026-12-31',
    imagem: aveiaFlocos
  },
  {
    id: 6,
    nome: 'Chá Verde Orgânico Sachê 20g',
    preco: '12.00',
    quantidade: '15',
    dataVencimento: '2028-01-10',
    imagem: chaVerde
  }
];