export interface DriveFormFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export interface FormQuestionInfo {
  questionId: string;
  title: string;
}

export interface GoogleFormDetails {
  formId: string;
  title: string;
  description?: string;
  responderUri: string;
  questions: FormQuestionInfo[];
}

export interface GoogleFormResponseRow {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  respondentEmail?: string;
  answersByQuestionId: Record<string, string>;
}

interface RawGoogleFormItem {
  title?: string;
  questionItem?: {
    question?: {
      questionId?: string;
    };
  };
  questionGroupItem?: {
    questions?: Array<{
      questionId?: string;
    }>;
  };
}

interface RawGoogleForm {
  formId: string;
  info?: {
    title?: string;
    description?: string;
  };
  responderUri?: string;
  items?: RawGoogleFormItem[];
}

interface RawFormResponse {
  responseId: string;
  createTime: string;
  lastSubmittedTime: string;
  respondentEmail?: string;
  answers?: Record<
    string,
    {
      questionId?: string;
      textAnswers?: {
        answers?: Array<{ value?: string }>;
      };
    }
  >;
}

async function parseGoogleApiError(res: Response, fallback: string): Promise<string> {
  try {
    const data = (await res.json()) as { error?: { message?: string } };
    if (data?.error?.message) {
      return data.error.message;
    }
  } catch {
    // Ignore JSON parse failures
  }
  return `${fallback} (HTTP ${res.status})`;
}

export async function listGoogleForms(accessToken: string): Promise<DriveFormFile[]> {
  const query = encodeURIComponent(
    "mimeType='application/vnd.google-apps.form' and trashed=false"
  );
  const fields = encodeURIComponent('files(id,name,modifiedTime,webViewLink)');
  const orderBy = encodeURIComponent('modifiedTime desc');

  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=${orderBy}&pageSize=25`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(await parseGoogleApiError(res, 'Failed to list Google Forms from Drive'));
  }

  const data = (await res.json()) as { files?: DriveFormFile[] };
  return data.files ?? [];
}

export async function getGoogleFormDetails(
  accessToken: string,
  formId: string
): Promise<GoogleFormDetails> {
  const safeFormId = encodeURIComponent(formId.trim());
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${safeFormId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await parseGoogleApiError(res, 'Failed to load Google Form details'));
  }

  const form = (await res.json()) as RawGoogleForm;
  const questions: FormQuestionInfo[] = [];

  for (const item of form.items ?? []) {
    const qId = item.questionItem?.question?.questionId;
    if (qId) {
      questions.push({
        questionId: qId,
        title: item.title || 'Untitled Question',
      });
    }
  }

  return {
    formId: form.formId,
    title: form.info?.title || 'Untitled Google Form',
    description: form.info?.description,
    responderUri:
      form.responderUri || `https://docs.google.com/forms/d/${safeFormId}/viewform`,
    questions,
  };
}

export async function getGoogleFormResponses(
  accessToken: string,
  formId: string
): Promise<GoogleFormResponseRow[]> {
  const safeFormId = encodeURIComponent(formId.trim());
  const res = await fetch(`https://forms.googleapis.com/v1/forms/${safeFormId}/responses`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    throw new Error(await parseGoogleApiError(res, 'Failed to fetch Google Form responses'));
  }

  const data = (await res.json()) as { responses?: RawFormResponse[] };
  return (data.responses ?? []).map((resp) => {
    const answersByQuestionId: Record<string, string> = {};
    for (const [key, answerObj] of Object.entries(resp.answers ?? {})) {
      const qId = answerObj.questionId || key;
      const values = (answerObj.textAnswers?.answers ?? [])
        .map((a) => a.value?.trim() || '')
        .filter(Boolean);
      answersByQuestionId[qId] = values.join(', ');
    }
    return {
      responseId: resp.responseId,
      createTime: resp.createTime,
      lastSubmittedTime: resp.lastSubmittedTime,
      respondentEmail: resp.respondentEmail,
      answersByQuestionId,
    };
  });
}

export async function createWebsitePreviewForm(
  accessToken: string
): Promise<GoogleFormDetails> {
  // Step 1: Create the Form shell
  const createRes = await fetch('https://forms.googleapis.com/v1/forms', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      info: {
        title: 'Webtron Solution — Free 15-Minute Website Preview Request',
        documentTitle: 'Webtron Solution — Website Preview Leads',
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(await parseGoogleApiError(createRes, 'Failed to create Google Form'));
  }

  const created = (await createRes.json()) as RawGoogleForm;
  const safeFormId = encodeURIComponent(created.formId.trim());

  // Step 2: Populate description and the 8 intake questions via batchUpdate
  const batchRes = await fetch(
    `https://forms.googleapis.com/v1/forms/${safeFormId}:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeFormInResponse: true,
        requests: [
          {
            updateFormInfo: {
              info: {
                description:
                  'Tell us a little about your business and your website requirements. Our team will review your information and aim to share your custom working website preview within 15 minutes.',
              },
              updateMask: 'description',
            },
          },
          {
            createItem: {
              item: {
                title: 'Full Name',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: { paragraph: false },
                  },
                },
              },
              location: { index: 0 },
            },
          },
          {
            createItem: {
              item: {
                title: 'Business Name',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: { paragraph: false },
                  },
                },
              },
              location: { index: 1 },
            },
          },
          {
            createItem: {
              item: {
                title: 'Business Email',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: { paragraph: false },
                  },
                },
              },
              location: { index: 2 },
            },
          },
          {
            createItem: {
              item: {
                title: 'WhatsApp / Phone Number',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: { paragraph: false },
                  },
                },
              },
              location: { index: 3 },
            },
          },
          {
            createItem: {
              item: {
                title: 'Country',
                questionItem: {
                  question: {
                    required: true,
                    choiceQuestion: {
                      type: 'DROP_DOWN',
                      options: [{ value: 'USA' }, { value: 'UK' }, { value: 'Other' }],
                    },
                  },
                },
              },
              location: { index: 4 },
            },
          },
          {
            createItem: {
              item: {
                title: 'Current Business Website (Optional)',
                questionItem: {
                  question: {
                    required: false,
                    textQuestion: { paragraph: false },
                  },
                },
              },
              location: { index: 5 },
            },
          },
          {
            createItem: {
              item: {
                title: 'Type of Website Required',
                questionItem: {
                  question: {
                    required: true,
                    choiceQuestion: {
                      type: 'DROP_DOWN',
                      options: [
                        { value: 'Business Website' },
                        { value: 'E-commerce Website' },
                        { value: 'Portfolio Website' },
                        { value: 'Landing Page' },
                        { value: 'Website Redesign' },
                        { value: 'Other' },
                      ],
                    },
                  },
                },
              },
              location: { index: 6 },
            },
          },
          {
            createItem: {
              item: {
                title: 'Briefly Describe Your Business and Requirements',
                questionItem: {
                  question: {
                    required: true,
                    textQuestion: { paragraph: true },
                  },
                },
              },
              location: { index: 7 },
            },
          },
        ],
      }),
    }
  );

  if (!batchRes.ok) {
    throw new Error(await parseGoogleApiError(batchRes, 'Failed to add fields to Google Form'));
  }

  const batchData = (await batchRes.json()) as { form?: RawGoogleForm };
  const populated = batchData.form ?? created;

  const questions: FormQuestionInfo[] = [];
  for (const item of populated.items ?? []) {
    const qId = item.questionItem?.question?.questionId;
    if (qId) {
      questions.push({
        questionId: qId,
        title: item.title || 'Untitled Question',
      });
    }
  }

  return {
    formId: populated.formId,
    title: populated.info?.title || 'Webtron Solution — Free 15-Minute Website Preview Request',
    description: populated.info?.description,
    responderUri:
      populated.responderUri || `https://docs.google.com/forms/d/${safeFormId}/viewform`,
    questions,
  };
}
