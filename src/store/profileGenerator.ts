import { Competency, calculateStatus } from './mockData';

export interface OfficialProfileInput {
  name: string;
  designation: string;
  department: string;
  jobRole: string;
  currentAssignment: string;
  educationalQualifications: string;
  workExperience: string;
  previousTrainings: string[];
}

export function generateCompetencyProfile(input: OfficialProfileInput): Record<string, Competency> {
  // Base masteries
  let dataCollectionMastery = 70;
  let dataValidationMastery = 60;
  let basicStatsMastery = 75;
  let probabilityMastery = 35;
  let samplingFundMastery = 45;
  let samplingMethodsMastery = 40;
  let surveyDesignMastery = 10;
  let analysisMastery = 65;

  const roleLower = (input.jobRole || '').toLowerCase();
  const desigLower = (input.designation || '').toLowerCase();
  const deptLower = (input.department || '').toLowerCase();
  const assignLower = (input.currentAssignment || '').toLowerCase();
  const eduLower = (input.educationalQualifications || '').toLowerCase();
  const expLower = (input.workExperience || '').toLowerCase();
  const trainings = input.previousTrainings || [];

  // 1. Education Impact
  if (eduLower.includes('m.sc') || eduLower.includes('master') || eduLower.includes('post graduate')) {
    basicStatsMastery += 12;
    probabilityMastery += 10;
    analysisMastery += 8;
  }
  if (eduLower.includes('statistic') || eduLower.includes('mathematics') || eduLower.includes('econometrics')) {
    basicStatsMastery += 8;
    probabilityMastery += 6;
  }

  // 2. Experience Impact
  if (expLower.includes('6-10') || expLower.includes('10+') || expLower.includes('senior')) {
    dataCollectionMastery += 15;
    dataValidationMastery += 15;
    samplingFundMastery += 12;
    surveyDesignMastery += 20;
  } else if (expLower.includes('3-5')) {
    dataCollectionMastery += 10;
    dataValidationMastery += 8;
    samplingFundMastery += 6;
  }

  // 3. Department & Assignment Impact (e.g. NSSO / FOD / PLFS / ASI)
  if (deptLower.includes('nsso') || deptLower.includes('fod') || deptLower.includes('sample') || assignLower.includes('plfs') || assignLower.includes('survey')) {
    dataCollectionMastery += 12;
    dataValidationMastery += 10;
    samplingMethodsMastery += 8;
  }
  if (assignLower.includes('asi') || deptLower.includes('cso') || deptLower.includes('economic')) {
    dataValidationMastery += 12;
    analysisMastery += 10;
  }

  // 4. Job Role Impact
  if (roleLower.includes('supervisor') || roleLower.includes('auditor') || roleLower.includes('field')) {
    dataCollectionMastery = Math.min(95, dataCollectionMastery + 10);
    dataValidationMastery = Math.min(90, dataValidationMastery + 8);
  }
  if (roleLower.includes('methodolog') || roleLower.includes('analyst') || roleLower.includes('design')) {
    samplingFundMastery = Math.min(85, samplingFundMastery + 12);
    samplingMethodsMastery = Math.min(80, samplingMethodsMastery + 10);
    surveyDesignMastery = Math.min(75, surveyDesignMastery + 25);
  }

  // 5. Previous Trainings Impact
  trainings.forEach(t => {
    const tLower = t.toLowerCase();
    if (tLower.includes('sampling')) {
      samplingFundMastery = Math.min(90, samplingFundMastery + 10);
      samplingMethodsMastery = Math.min(85, samplingMethodsMastery + 10);
    }
    if (tLower.includes('capi') || tLower.includes('digital') || tLower.includes('field')) {
      dataCollectionMastery = Math.min(95, dataCollectionMastery + 8);
    }
    if (tLower.includes('validation') || tLower.includes('quality')) {
      dataValidationMastery = Math.min(92, dataValidationMastery + 8);
    }
    if (tLower.includes('python') || tLower.includes('r ') || tLower.includes('analytics')) {
      analysisMastery = Math.min(90, analysisMastery + 10);
    }
  });

  // Clamp 0-100
  const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  const finalCollection = clamp(dataCollectionMastery);
  const finalValidation = clamp(dataValidationMastery);
  const finalBasicStats = clamp(basicStatsMastery);
  const finalProbability = clamp(probabilityMastery);
  const finalSamplingFund = clamp(samplingFundMastery);
  const finalSamplingMeth = clamp(samplingMethodsMastery);
  const finalSurveyDesign = clamp(surveyDesignMastery);
  const finalAnalysis = clamp(analysisMastery);

  return {
    'c_data_collection': {
      id: 'c_data_collection',
      name: 'Data Collection',
      category: 'Operations',
      mastery: finalCollection,
      prerequisites: [],
      status: calculateStatus(finalCollection),
    },
    'c_data_validation': {
      id: 'c_data_validation',
      name: 'Data Validation',
      category: 'Operations',
      mastery: finalValidation,
      prerequisites: ['c_data_collection'],
      status: calculateStatus(finalValidation),
    },
    'c_basic_stats': {
      id: 'c_basic_stats',
      name: 'Basic Statistics',
      category: 'Analytics',
      mastery: finalBasicStats,
      prerequisites: [],
      status: calculateStatus(finalBasicStats),
    },
    'c_probability': {
      id: 'c_probability',
      name: 'Probability Fundamentals',
      category: 'Analytics',
      mastery: finalProbability,
      prerequisites: ['c_basic_stats'],
      status: calculateStatus(finalProbability),
    },
    'c_sampling_fundamentals': {
      id: 'c_sampling_fundamentals',
      name: 'Sampling Fundamentals',
      category: 'Methodology',
      mastery: finalSamplingFund,
      prerequisites: ['c_basic_stats'],
      status: calculateStatus(finalSamplingFund),
    },
    'c_sampling_methods': {
      id: 'c_sampling_methods',
      name: 'Sampling Methods',
      category: 'Methodology',
      mastery: finalSamplingMeth,
      prerequisites: ['c_probability', 'c_sampling_fundamentals'],
      status: calculateStatus(finalSamplingMeth),
    },
    'c_survey_design': {
      id: 'c_survey_design',
      name: 'Survey Design',
      category: 'Methodology',
      mastery: finalSurveyDesign,
      prerequisites: ['c_sampling_methods'],
      status: calculateStatus(finalSurveyDesign),
    },
    'c_analysis': {
      id: 'c_analysis',
      name: 'Statistical Analysis',
      category: 'Analytics',
      mastery: finalAnalysis,
      prerequisites: ['c_basic_stats'],
      status: calculateStatus(finalAnalysis),
    },
  };
}
