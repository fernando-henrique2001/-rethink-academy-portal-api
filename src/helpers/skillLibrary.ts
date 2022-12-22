export const skillLibrary = {
  ENGINEERING: {
    BackEnd: "skill1",
    FrontEnd: "skill2",
    ["HTML e CSS"]: "skill3",
    React: "skill4",
    JavaScript: "skill5",
    TypeScript: "skill6",
  },
  DESIGN: {
    Pesquisas: "skill1",
    ["Facilitação de Workshop"]: "skill2",
    ["Wireframe e Fluxo"]: "skill3",
    ["Design system"]: "skill4",
    ["Product Design"]: "skill5",
    ["Padronização e Documentação"]: "skill6",
  },
  PRODUCT: {
    Produto: "skill1",
    Pessoas: "skill2",
    Processos: "skill3",
    Estratégia: "skill4",
    Performance: "skill5",
    Evolução: "skill6",
  },
  SOFT: {
    Empatia: "skill1",
    ["Resolução de Problemas"]: "skill2",
    Comunicação: "skill3",
    ["Inteligencia emocial"]: "skill4",
    Autoconfiança: "skill5",
    ["Gestão de tempo"]: "skill6",
  },
};

export type skillLibraryType = {
  value: number;
  main: "ENGINEERING" | "DESIGN" | "PRODUCT" | "SOFT";
  userId: string;
  skill: string;
};
