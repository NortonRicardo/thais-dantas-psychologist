export type GooglePlaceReview = {
  authorName: string
  rating: number
  text: string
  relativeTime: string
  photoUrl?: string
}

export type GooglePlaceData = {
  rating: number
  userRatingCount: number
  reviews: GooglePlaceReview[]
  mapsUri: string | null
}

/** Avaliações reais copiadas manualmente do Google Maps (ver comentarios.text). */
export const GOOGLE_REVIEWS_FALLBACK: GooglePlaceData = {
  rating: 5.0,
  userRatingCount: 23,
  mapsUri: 'https://share.google/h3iYSMJq8UlSLwM4j',
  reviews: [
    {
      authorName: 'Rafi Maia',
      rating: 5,
      relativeTime: 'um ano atrás',
      text: 'A Taís me ajudou a trabalhar minha compulsão alimentar e posso dizer com propriedade que ela mudou a minha vida! Com muita empatia, acolhimento e profissionalismo, ela me guiou por um processo de autoconhecimento que fez toda a diferença. Sou extremamente grata por ter encontrado uma terapeuta tão competente e humana.',
      photoUrl:
        'https://lh3.googleusercontent.com/a-/ALV-UjWecrS8RHHkil8y-W3yq_GruNZsCQnZCy0-D6bKeSBt8RmyOpN1=s64-c-rp-mo-ba12-br100',
    },
    {
      authorName: 'Tatiane ALVES',
      rating: 5,
      relativeTime: '2 anos atrás',
      text: 'A psicóloga Taís é uma pessoa incrível e uma excelente profissional, muito ética, empática, amiga e transmite muita paz. Eu gosto muito da forma como ela trabalha.',
      photoUrl:
        'https://lh3.googleusercontent.com/a-/ALV-UjVxBVYNj68D2eXsPOciS9glni-cTEXCAwL4zy8tohehtOvt-1BV=s64-c-rp-mo-br100',
    },
    {
      authorName: 'Hamielly Rodrigues dos Santos de Souza',
      rating: 5,
      relativeTime: '2 anos atrás',
      text: 'Melhor profissional que já conheci super recomendo! Dra Thais super atenciosa.',
      photoUrl:
        'https://lh3.googleusercontent.com/a-/ALV-UjUttWHR9U9Hm_aq-toDeA5aBXpTckBbeMOlncSRq42s7sUfx6R-BQ=s64-c-rp-mo-br100',
    },
    {
      authorName: 'Thaise Lopes',
      rating: 5,
      relativeTime: '2 anos atrás',
      text: 'Psicóloga maravilhosa. Calma, tranquila e que passa muita confiança. Consultório aconchegante.',
      photoUrl:
        'https://lh3.googleusercontent.com/a-/ALV-UjWjSWxw42fpQrVs_hXCHQz733-EAc657sChIJdjFBureAq7I6qc=s64-c-rp-mo-br100',
    },
    {
      authorName: 'Bê Souto',
      rating: 5,
      relativeTime: '2 anos atrás',
      text: 'Ambiente muito confortável e profissional incrível!',
      photoUrl:
        'https://lh3.googleusercontent.com/a-/ALV-UjXIvVEwaA4gKIDwvTlW9a7deHDd6bPTby_R190Yj5G3m9sVKT6X8g=s64-c-rp-mo-ba12-br100',
    },
  ],
}
