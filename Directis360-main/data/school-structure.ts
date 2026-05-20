export interface Subject {
  id: string;
  name: {
    name_fr: string;
    name_en: string;
    name_ar: string;
  };
  obligatory: boolean;
  coefficient: number;
}

export interface Level {
  level: number;
  modulesCount: number;
  optionalModulesCount: number;
  modules: Subject[];
}

export interface Speciality {
  name: {
    name_fr: string;
    name_en: string;
    name_ar: string;
  };
  levelsCount: number;
  levels: Level[];
}

export interface SchoolType {
  specialities: Speciality[];
}

export interface SchoolStructure {
  primaire: SchoolType;
  cem: SchoolType;
  lycee: SchoolType;
}

export const SCHOOL_STRUCTURE: SchoolStructure = {
  primaire: {
    specialities: [
      {
        name: {
          name_fr: "Tronc Commun Primaire",
          name_en: "Primary Education",
          name_ar: "التعليم الابتدائي",
        },
        levelsCount: 5,
        levels: [
          {
            level: 1,
            modulesCount: 7,
            optionalModulesCount: 0,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "scientific_education",
                name: {
                  name_fr: "Éducation Scientifique et Technologique",
                  name_en: "Scientific and Technological Education",
                  name_ar: "التربية العلمية والتكنولوجية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_music_education",
                name: {
                  name_fr: "Éducation Artistique et Musicale",
                  name_en: "Artistic and Musical Education",
                  name_ar: "التربية الفنية والموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 2,
            modulesCount: 7,
            optionalModulesCount: 0,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "scientific_education",
                name: {
                  name_fr: "Éducation Scientifique et Technologique",
                  name_en: "Scientific and Technological Education",
                  name_ar: "التربية العلمية والتكنولوجية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_music_education",
                name: {
                  name_fr: "Éducation Artistique et Musicale",
                  name_en: "Artistic and Musical Education",
                  name_ar: "التربية الفنية والموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 9,
            optionalModulesCount: 0,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "scientific_education",
                name: {
                  name_fr: "Éducation Scientifique et Technologique",
                  name_en: "Scientific and Technological Education",
                  name_ar: "التربية العلمية والتكنولوجية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_music_education",
                name: {
                  name_fr: "Éducation Artistique et Musicale",
                  name_en: "Artistic and Musical Education",
                  name_ar: "التربية الفنية والموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 4,
            modulesCount: 9,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 1,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "scientific_education",
                name: {
                  name_fr: "Éducation Scientifique et Technologique",
                  name_en: "Scientific and Technological Education",
                  name_ar: "التربية العلمية والتكنولوجية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_music_education",
                name: {
                  name_fr: "Éducation Artistique et Musicale",
                  name_en: "Artistic and Musical Education",
                  name_ar: "التربية الفنية والموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 5,
            modulesCount: 9,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 1,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "scientific_education",
                name: {
                  name_fr: "Éducation Scientifique et Technologique",
                  name_en: "Scientific and Technological Education",
                  name_ar: "التربية العلمية والتكنولوجية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_music_education",
                name: {
                  name_fr: "Éducation Artistique et Musicale",
                  name_en: "Artistic and Musical Education",
                  name_ar: "التربية الفنية والموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  cem: {
    specialities: [
      {
        name: {
          name_fr: "Tronc Commun CEM",
          name_en: "Middle School Education",
          name_ar: "التعليم المتوسط",
        },
        levelsCount: 4,
        levels: [
          {
            level: 1,
            modulesCount: 12,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 1,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences de la Nature et de la Vie",
                  name_en: "Natural and Life Sciences",
                  name_ar: "علوم الطبيعة والحياة",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physics_technology",
                name: {
                  name_fr: "Physique et Technologie",
                  name_en: "Physics and Technology",
                  name_ar: "الفيزياء والتكنولوجيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Plastique",
                  name_en: "Visual Arts Education",
                  name_ar: "التربية التشكيلية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "music_education",
                name: {
                  name_fr: "Éducation Musicale",
                  name_en: "Music Education",
                  name_ar: "التربية الموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 2,
            modulesCount: 12,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 1,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences de la Nature et de la Vie",
                  name_en: "Natural and Life Sciences",
                  name_ar: "علوم الطبيعة والحياة",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physics_technology",
                name: {
                  name_fr: "Physique et Technologie",
                  name_en: "Physics and Technology",
                  name_ar: "الفيزياء والتكنولوجيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Plastique",
                  name_en: "Visual Arts Education",
                  name_ar: "التربية التشكيلية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "music_education",
                name: {
                  name_fr: "Éducation Musicale",
                  name_en: "Music Education",
                  name_ar: "التربية الموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 12,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 1,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences de la Nature et de la Vie",
                  name_en: "Natural and Life Sciences",
                  name_ar: "علوم الطبيعة والحياة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physics_technology",
                name: {
                  name_fr: "Physique et Technologie",
                  name_en: "Physics and Technology",
                  name_ar: "الفيزياء والتكنولوجيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Plastique",
                  name_en: "Visual Arts Education",
                  name_ar: "التربية التشكيلية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "music_education",
                name: {
                  name_fr: "Éducation Musicale",
                  name_en: "Music Education",
                  name_ar: "التربية الموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
          {
            level: 4,
            modulesCount: 12,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences de la Nature et de la Vie",
                  name_en: "Natural and Life Sciences",
                  name_ar: "علوم الطبيعة والحياة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physics_technology",
                name: {
                  name_fr: "Physique et Technologie",
                  name_en: "Physics and Technology",
                  name_ar: "الفيزياء والتكنولوجيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "islamic_education",
                name: {
                  name_fr: "Éducation Islamique",
                  name_en: "Islamic Education",
                  name_ar: "التربية الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "civic_education",
                name: {
                  name_fr: "Éducation Civique",
                  name_en: "Civic Education",
                  name_ar: "التربية المدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Plastique",
                  name_en: "Visual Arts Education",
                  name_ar: "التربية التشكيلية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "music_education",
                name: {
                  name_fr: "Éducation Musicale",
                  name_en: "Music Education",
                  name_ar: "التربية الموسيقية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique et Sportive",
                  name_en: "Physical and Sports Education",
                  name_ar: "التربية البدنية والرياضية",
                },
                obligatory: true,
                coefficient: 1,
              },
            ],
          },
        ],
      },
    ],
  },
  lycee: {
    specialities: [
      {
        name: {
          name_fr: "Tronc Commun Sciences et Technologie",
          name_en: "Common Core for Science and Technology",
          name_ar: "جذع مشترك علوم وتكنولوجيا",
        },
        levelsCount: 1,
        levels: [
          {
            level: 1,
            modulesCount: 12,
            optionalModulesCount: 1,
            modules: [
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "physics",
                name: {
                  name_fr: "Sciences Physiques",
                  name_en: "Physical Sciences",
                  name_ar: "العلوم الفيزيائية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences Naturelles",
                  name_en: "Natural Sciences",
                  name_ar: "العلوم الطبيعية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "technology",
                name: {
                  name_fr: "Technologie",
                  name_en: "Technology",
                  name_ar: "تكنولوجيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Artistique",
                  name_en: "Artistic Education",
                  name_ar: "تربية فنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: {
          name_fr: "Tronc Commun Lettres",
          name_en: "Common Core for Arts",
          name_ar: "جذع مشترك آداب",
        },
        levelsCount: 1,
        levels: [
          {
            level: 1,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physics",
                name: {
                  name_fr: "Sciences Physiques",
                  name_en: "Physical Sciences",
                  name_ar: "العلوم الفيزيائية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences Naturelles",
                  name_en: "Natural Sciences",
                  name_ar: "العلوم الطبيعية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Artistique",
                  name_en: "Artistic Education",
                  name_ar: "تربية فنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: {
          name_fr: "Sciences Expérimentales",
          name_en: "Experimental Sciences",
          name_ar: "علوم تجريبية",
        },
        levelsCount: 2,
        levels: [
          {
            level: 2,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences Naturelles",
                  name_en: "Natural Sciences",
                  name_ar: "العلوم الطبيعية",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "physics_chemistry",
                name: {
                  name_fr: "Physique - Chimie",
                  name_en: "Physics - Chemistry",
                  name_ar: "الفيزياء - الكيمياء",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences Naturelles",
                  name_en: "Natural Sciences",
                  name_ar: "العلوم الطبيعية",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "physics_chemistry",
                name: {
                  name_fr: "Physique - Chimie",
                  name_en: "Physics - Chemistry",
                  name_ar: "الفيزياء - الكيمياء",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: {
          name_fr: "Mathématiques",
          name_en: "Mathematics",
          name_ar: "رياضيات",
        },
        levelsCount: 2,
        levels: [
          {
            level: 2,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "physics_chemistry",
                name: {
                  name_fr: "Physique - Chimie",
                  name_en: "Physics - Chemistry",
                  name_ar: "الفيزياء - الكيمياء",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences Naturelles",
                  name_en: "Natural Sciences",
                  name_ar: "العلوم الطبيعية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 7,
              },
              {
                id: "physics_chemistry",
                name: {
                  name_fr: "Physique - Chimie",
                  name_en: "Physics - Chemistry",
                  name_ar: "الفيزياء - الكيمياء",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "natural_sciences",
                name: {
                  name_fr: "Sciences Naturelles",
                  name_en: "Natural Sciences",
                  name_ar: "العلوم الطبيعية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: {
          name_fr: "Gestion et Économie",
          name_en: "Management and Economics",
          name_ar: "تسيير واقتصاد",
        },
        levelsCount: 2,
        levels: [
          {
            level: 2,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "management_economics",
                name: {
                  name_fr: "Économie et Management",
                  name_en: "Economics and Management",
                  name_ar: "الاقتصاد والمناجمنت",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "accounting",
                name: {
                  name_fr: "Comptabilité et Mathématiques Financières",
                  name_en: "Accounting and Financial Math",
                  name_ar: "المحاسبة والرياضيات المالية",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "law",
                name: { name_fr: "Droit", name_en: "Law", name_ar: "القانون" },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "accounting",
                name: {
                  name_fr: "Comptabilité et Gestion Financière",
                  name_en: "Accounting and Financial Management",
                  name_ar: "التسيير المحاسبي والمالي",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "management_economics",
                name: {
                  name_fr: "Économie et Management",
                  name_en: "Economics and Management",
                  name_ar: "الاقتصاد والمناجمنت",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "law",
                name: { name_fr: "Droit", name_en: "Law", name_ar: "القانون" },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: {
          name_fr: "Lettres et Philosophie",
          name_en: "Arts and Philosophy",
          name_ar: "آداب وفلسفة",
        },
        levelsCount: 2,
        levels: [
          {
            level: 2,
            modulesCount: 10,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue et Littérature Arabe",
                  name_en: "Arabic Language and Literature",
                  name_ar: "اللغة العربية وآدابها",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Artistique",
                  name_en: "Artistic Education",
                  name_ar: "تربية فنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 10,
            optionalModulesCount: 1,
            modules: [
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue et Littérature Arabe",
                  name_en: "Arabic Language and Literature",
                  name_ar: "اللغة العربية وآدابها",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Artistique",
                  name_en: "Artistic Education",
                  name_ar: "تربية فنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: {
          name_fr: "Langues Étrangères",
          name_en: "Foreign Languages",
          name_ar: "لغات أجنبية",
        },
        levelsCount: 2,
        levels: [
          {
            level: 2,
            modulesCount: 10,
            optionalModulesCount: 1,
            modules: [
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "third_foreign_language",
                name: {
                  name_fr: "Troisième Langue Étrangère",
                  name_en: "Third Foreign Language",
                  name_ar: "اللغة الأجنبية الثالثة",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "art_education",
                name: {
                  name_fr: "Éducation Artistique",
                  name_en: "Artistic Education",
                  name_ar: "تربية فنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 10,
            optionalModulesCount: 1,
            modules: [
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 5,
              },
              {
                id: "third_foreign_language",
                name: {
                  name_fr: "Troisième Langue Étrangère",
                  name_en: "Third Foreign Language",
                  name_ar: "اللغة الأجنبية الثالثة",
                },
                obligatory: true,
                coefficient: 4,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
      {
        name: { name_fr: "Arts", name_en: "Arts", name_ar: "فنون" },
        levelsCount: 2,
        levels: [
          {
            level: 2,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "specialty_art",
                name: {
                  name_fr: "Art de Spécialité",
                  name_en: "Specialty Art",
                  name_ar: "فن التخصص",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "art_history",
                name: {
                  name_fr: "Histoire de l'Art",
                  name_en: "History of Art",
                  name_ar: "تاريخ الفن",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "art_culture",
                name: {
                  name_fr: "Culture Artistique",
                  name_en: "Artistic Culture",
                  name_ar: "ثقافة فنية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "mathematics",
                name: {
                  name_fr: "Mathématiques",
                  name_en: "Mathematics",
                  name_ar: "الرياضيات",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
          {
            level: 3,
            modulesCount: 11,
            optionalModulesCount: 1,
            modules: [
              {
                id: "specialty_art",
                name: {
                  name_fr: "Art de Spécialité",
                  name_en: "Specialty Art",
                  name_ar: "فن التخصص",
                },
                obligatory: true,
                coefficient: 6,
              },
              {
                id: "art_history",
                name: {
                  name_fr: "Histoire de l'Art",
                  name_en: "History of Art",
                  name_ar: "تاريخ الفن",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "art_culture",
                name: {
                  name_fr: "Culture Artistique",
                  name_en: "Artistic Culture",
                  name_ar: "ثقافة فنية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "philosophy",
                name: {
                  name_fr: "Philosophie",
                  name_en: "Philosophy",
                  name_ar: "الفلسفة",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "arabic_language",
                name: {
                  name_fr: "Langue Arabe",
                  name_en: "Arabic Language",
                  name_ar: "اللغة العربية",
                },
                obligatory: true,
                coefficient: 3,
              },
              {
                id: "french_language",
                name: {
                  name_fr: "Langue Française",
                  name_en: "French Language",
                  name_ar: "اللغة الفرنسية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "english_language",
                name: {
                  name_fr: "Langue Anglaise",
                  name_en: "English Language",
                  name_ar: "اللغة الإنجليزية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "history_geography",
                name: {
                  name_fr: "Histoire et Géographie",
                  name_en: "History and Geography",
                  name_ar: "التاريخ والجغرافيا",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "islamic_sciences",
                name: {
                  name_fr: "Sciences Islamiques",
                  name_en: "Islamic Sciences",
                  name_ar: "العلوم الإسلامية",
                },
                obligatory: true,
                coefficient: 2,
              },
              {
                id: "physical_education",
                name: {
                  name_fr: "Éducation Physique",
                  name_en: "Physical Education",
                  name_ar: "التربية البدنية",
                },
                obligatory: true,
                coefficient: 1,
              },
              {
                id: "amazigh_language",
                name: {
                  name_fr: "Langue Amazighe",
                  name_en: "Amazigh Language",
                  name_ar: "اللغة الأمازيغية",
                },
                obligatory: false,
                coefficient: 2,
              },
            ],
          },
        ],
      },
    ],
  },
};

// Helper functions to get grades and subjects
export function getGradesBySchoolType(
  schoolType: keyof SchoolStructure
): string[] {
  const grades: string[] = [];

  if (schoolType === "primaire") {
    for (let i = 1; i <= 5; i++) {
      grades.push(`${i}AP`);
    }
  } else if (schoolType === "cem") {
    for (let i = 1; i <= 4; i++) {
      grades.push(`${i}AC`);
    }
  } else if (schoolType === "lycee") {
    grades.push("1");
    grades.push("2");
    grades.push("3");
  }

  return grades;
}

export function getSubjectsByGradeAndSpeciality(
  schoolType: keyof SchoolStructure,
  grade: string,
  specialityName?: string
): string[] {
  const schoolData = SCHOOL_STRUCTURE[schoolType];
  const subjects: string[] = [];

  // Extract level number from grade
  let level = 1;
  if (schoolType === "primaire") {
    level = Number.parseInt(grade.replace("AP", ""));
  } else if (schoolType === "cem") {
    level = Number.parseInt(grade.replace("AC", ""));
  } else if (schoolType === "lycee") {
    level = Number.parseInt(grade.replace("AS", ""));
  }

  // Find the appropriate speciality and level
  for (const speciality of schoolData.specialities) {
    if (specialityName && speciality.name.name_en !== specialityName) continue;

    const levelData = speciality.levels.find((l) => l.level === level);
    if (levelData) {
      levelData.modules.forEach((module) => {
        subjects.push(module.name.name_en);
      });
      break;
    }
  }

  return subjects;
}

export function getAllSubjects(): string[] {
  const allSubjects = new Set<string>();

  Object.values(SCHOOL_STRUCTURE).forEach((schoolType) => {
    schoolType.specialities.forEach((speciality) => {
      speciality.levels.forEach((level) => {
        level.modules.forEach((module) => {
          allSubjects.add(module.name.name_en);
        });
      });
    });
  });

  return Array.from(allSubjects);
}

export function getSpecialitiesBySchoolType(
  schoolType: keyof SchoolStructure
): string[] {
  return SCHOOL_STRUCTURE[schoolType].specialities.map((s) => s.name.name_en);
}
