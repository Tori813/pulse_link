document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const symptomInput = document.getElementById('symptomInput');
    const symptomSuggestions = document.getElementById('symptomSuggestions');
    const addSymptomBtn = document.getElementById('addSymptom');
    const symptomsList = document.getElementById('symptomsList');
    const analyzeBtn = document.getElementById('analyzeSymptoms');
    const clearBtn = document.getElementById('clearSymptoms');
    const resultsContainer = document.getElementById('resultsContainer');
    const backToSymptomsBtn = document.getElementById('backToSymptoms');
    const conditionsList = document.getElementById('conditionsList');
    const emergencyWarning = document.getElementById('emergencyWarning');
    const additionalQuestions = document.getElementById('additionalQuestions');
    const symptomDetailModal = document.getElementById('symptomDetailModal');
    const symptomModalTitle = document.getElementById('symptomModalTitle');
    const symptomModalBody = document.getElementById('symptomModalBody');

    // Comprehensive symptom database (in a real app, this would come from an API)
    const symptomDatabase = [
        // General Symptoms
        { id: 's1', name: 'Fever', description: 'Elevated body temperature above the normal range.' },
        { id: 's2', name: 'Fatigue', description: 'A feeling of constant tiredness or weakness.' },
        { id: 's3', name: 'Dizziness', description: 'A sensation of spinning or lightheadedness.' },
        { id: 's4', name: 'Weakness', description: 'Lack of physical or muscle strength.' },
        { id: 's5', name: 'Malaise', description: 'A general feeling of discomfort, illness, or unease.' },
        { id: 's6', name: 'Fainting', description: 'Temporary loss of consciousness.' },
        { id: 's7', name: 'Chills', description: 'Feeling cold with shivering or shaking.' },
        { id: 's8', name: 'Night sweats', description: 'Excessive sweating during sleep.' },
        { id: 's9', name: 'Unintended weight loss', description: 'Losing weight without trying.' },
        { id: 's10', name: 'Unintended weight gain', description: 'Gaining weight without trying.' },
        { id: 's11', name: 'Swelling', description: 'Enlargement of organs, skin, or other body parts.' },
        { id: 's12', name: 'Lump or mass', description: 'An abnormal swelling or growth.' },
        
        // Head and Neurological Symptoms
        { id: 's13', name: 'Headache', description: 'Pain or discomfort in the head or face area.' },
        { id: 's14', name: 'Migraine', description: 'Severe, recurring headache often with nausea and visual disturbances.' },
        { id: 's15', name: 'Confusion', description: 'Difficulty thinking clearly or concentrating.' },
        { id: 's16', name: 'Memory loss', description: 'Unusual forgetfulness or amnesia.' },
        { id: 's17', name: 'Seizures', description: 'Sudden, uncontrolled electrical disturbance in the brain.' },
        { id: 's18', name: 'Numbness', description: 'Reduced or absent sensation in a part of the body.' },
        { id: 's19', name: 'Tingling', description: 'Prickling or pins-and-needles sensation.' },
        { id: 's20', name: 'Tremor', description: 'Rhythmic shaking or trembling.' },
        { id: 's21', name: 'Loss of coordination', description: 'Difficulty with balance and fine motor skills.' },
        { id: 's22', name: 'Speech difficulties', description: 'Trouble speaking or understanding speech.' },
        { id: 's23', name: 'Vision changes', description: 'Blurred vision, double vision, or vision loss.' },
        { id: 's24', name: 'Hearing loss', description: 'Partial or complete inability to hear.' },
        { id: 's25', name: 'Ringing in ears', description: 'Perception of noise or ringing in the ears (tinnitus).' },
        
        // Eye Symptoms
        { id: 's26', name: 'Eye pain', description: 'Discomfort in or around the eye.' },
        { id: 's27', name: 'Eye redness', description: 'Redness in the white part of the eye.' },
        { id: 's28', name: 'Dry eyes', description: 'Eyes feel dry, gritty, or irritated.' },
        { id: 's29', name: 'Eye discharge', description: 'Pus or mucus coming from the eye.' },
        { id: 's30', name: 'Sensitivity to light', description: 'Discomfort in the eyes when exposed to light.' },
        { id: 's31', name: 'Floaters', description: 'Spots or threads that seem to float in your vision.' },
        { id: 's32', name: 'Eye twitching', description: 'Involuntary eyelid muscle contractions.' },
        
        // Ear, Nose, and Throat
        { id: 's33', name: 'Ear pain', description: 'Pain in or around the ear.' },
        { id: 's34', name: 'Ear discharge', description: 'Fluid draining from the ear.' },
        { id: 's35', name: 'Nasal congestion', description: 'Stuffy or blocked nose.' },
        { id: 's36', name: 'Runny nose', description: 'Excess nasal mucus production.' },
        { id: 's37', name: 'Nosebleed', description: 'Bleeding from the nose.' },
        { id: 's38', name: 'Sinus pain', description: 'Pain or pressure in the sinuses.' },
        { id: 's39', name: 'Sore throat', description: 'Pain, scratchiness or irritation of the throat.' },
        { id: 's40', name: 'Difficulty swallowing', description: 'Trouble moving food or liquid from mouth to stomach.' },
        { id: 's41', name: 'Hoarseness', description: 'Abnormal voice changes, such as a raspy or strained voice.' },
        { id: 's42', name: 'Swollen lymph nodes', description: 'Enlarged lymph nodes, often in the neck, armpits, or groin.' },
        
        // Respiratory Symptoms
        { id: 's43', name: 'Cough', description: 'A sudden expulsion of air from the lungs.' },
        { id: 's44', name: 'Shortness of breath', description: 'Difficulty breathing or feeling winded.' },
        { id: 's45', name: 'Wheezing', description: 'High-pitched whistling sound when breathing.' },
        { id: 's46', name: 'Chest congestion', description: 'Feeling of tightness or pressure in the chest.' },
        { id: 's47', name: 'Chest pain', description: 'Pain or discomfort in the chest area.' },
        { id: 's48', name: 'Rapid breathing', description: 'Abnormally fast breathing (tachypnea).' },
        { id: 's49', name: 'Coughing up blood', description: 'Blood in the sputum when coughing (hemoptysis).' },
        
        // Cardiovascular Symptoms
        { id: 's50', name: 'Palpitations', description: 'Awareness of heartbeats that feel rapid or irregular.' },
        { id: 's51', name: 'Rapid heart rate', description: 'Heart rate over 100 beats per minute (tachycardia).' },
        { id: 's52', name: 'Slow heart rate', description: 'Heart rate below 60 beats per minute (bradycardia).' },
        { id: 's53', name: 'Chest tightness', description: 'Feeling of pressure or constriction in the chest.' },
        { id: 's54', name: 'Heartburn', description: 'Burning sensation in the chest, often after eating.' },
        { id: 's55', name: 'Swelling in legs', description: 'Fluid retention causing swelling in the lower extremities.' },
        { id: 's56', name: 'Cold hands or feet', description: 'Persistent coldness in the extremities.' },
        
        // Gastrointestinal Symptoms
        { id: 's57', name: 'Abdominal pain', description: 'Pain or discomfort in the area between the chest and pelvis.' },
        { id: 's58', name: 'Nausea', description: 'A feeling of sickness with an inclination to vomit.' },
        { id: 's59', name: 'Vomiting', description: 'Forceful expulsion of stomach contents through the mouth.' },
        { id: 's60', name: 'Diarrhea', description: 'Loose, watery stools occurring more than three times a day.' },
        { id: 's61', name: 'Constipation', description: 'Infrequent bowel movements or difficulty passing stools.' },
        { id: 's62', name: 'Bloating', description: 'Feeling of fullness or tightness in the abdomen.' },
        { id: 's63', name: 'Gas', description: 'Excess flatulence or belching.' },
        { id: 's64', name: 'Heartburn', description: 'Burning sensation in the chest, often after eating.' },
        { id: 's65', name: 'Loss of appetite', description: 'Decreased desire to eat.' },
        { id: 's66', name: 'Excessive hunger', description: 'Increased appetite or constant hunger.' },
        { id: 's67', name: 'Difficulty swallowing', description: 'Trouble moving food or liquid from mouth to stomach.' },
        { id: 's68', name: 'Blood in stool', description: 'Bright red or black, tarry stools indicating bleeding.' },
        { id: 's69', name: 'Rectal bleeding', description: 'Bleeding from the rectum.' },
        { id: 's70', name: 'Jaundice', description: 'Yellowing of the skin and eyes.' },
        
        // Urinary Symptoms
        { id: 's71', name: 'Frequent urination', description: 'Needing to urinate more often than usual.' },
        { id: 's72', name: 'Painful urination', description: 'Discomfort or burning sensation during urination.' },
        { id: 's73', name: 'Blood in urine', description: 'Pink, red, or brown urine indicating blood.' },
        { id: 's74', name: 'Urinary urgency', description: 'Sudden, strong need to urinate.' },
        { id: 's75', name: 'Incontinence', description: 'Inability to control urination.' },
        { id: 's76', name: 'Difficulty starting urination', description: 'Trouble initiating the urine stream.' },
        { id: 's77', name: 'Weak urine stream', description: 'Reduced force of urination.' },
        { id: 's78', name: 'Nocturia', description: 'Waking up at night to urinate.' },
        
        // Genital and Reproductive (Male)
        { id: 's79', name: 'Erectile dysfunction', description: 'Difficulty achieving or maintaining an erection.' },
        { id: 's80', name: 'Testicular pain', description: 'Pain or discomfort in the testicles.' },
        { id: 's81', name: 'Testicular swelling', description: 'Enlargement of one or both testicles.' },
        { id: 's82', name: 'Penile discharge', description: 'Abnormal discharge from the penis.' },
        { id: 's83', name: 'Decreased libido', description: 'Reduced sexual desire.' },
        
        // Genital and Reproductive (Female)
        { id: 's84', name: 'Vaginal itching', description: 'Itching in the vaginal area.' },
        { id: 's85', name: 'Vaginal discharge', description: 'Abnormal discharge from the vagina.' },
        { id: 's86', name: 'Vaginal bleeding', description: 'Bleeding not related to normal menstrual periods.' },
        { id: 's87', name: 'Painful periods', description: 'Severe menstrual cramps (dysmenorrhea).' },
        { id: 's88', name: 'Irregular periods', description: 'Menstrual cycles that are longer or shorter than normal.' },
        { id: 's89', name: 'Missed periods', description: 'Absence of menstrual periods (amenorrhea).' },
        { id: 's90', name: 'Heavy periods', description: 'Excessive menstrual bleeding (menorrhagia).' },
        { id: 's91', name: 'Pain during intercourse', description: 'Discomfort or pain during sexual activity (dyspareunia).' },
        { id: 's92', name: 'Pelvic pain', description: 'Pain in the lower abdomen and pelvis.' },
        { id: 's93', name: 'Hot flashes', description: 'Sudden feeling of warmth, often with sweating and blushing.' },
        
        // Musculoskeletal Symptoms
        { id: 's94', name: 'Joint pain', description: 'Pain, aches, or soreness in any joint.' },
        { id: 's95', name: 'Joint swelling', description: 'Enlargement or puffiness of a joint.' },
        { id: 's96', name: 'Joint stiffness', description: 'Reduced range of motion in a joint.' },
        { id: 's97', name: 'Muscle pain', description: 'Aches and pains in the muscles.' },
        { id: 's98', name: 'Muscle weakness', description: 'Reduced muscle strength.' },
        { id: 's99', name: 'Back pain', description: 'Pain in the upper, middle, or lower back.' },
        { id: 's100', name: 'Neck pain', description: 'Pain or stiffness in the neck area.' },
        { id: 's101', name: 'Bone pain', description: 'Deep, aching pain in the bones.' },
        { id: 's102', name: 'Limited range of motion', description: 'Reduced ability to move a joint through its full range.' },
        
        // Skin Symptoms
        { id: 's103', name: 'Rash', description: 'Change in skin color or texture.' },
        { id: 's104', name: 'Itching', description: 'Unpleasant sensation that provokes the desire to scratch.' },
        { id: 's105', name: 'Dry skin', description: 'Skin that lacks moisture.' },
        { id: 's106', name: 'Redness', description: 'Red appearance of the skin.' },
        { id: 's107', name: 'Bruising', description: 'Discoloration of the skin from bleeding underneath.' },
        { id: 's108', name: 'Hives', description: 'Red, raised, itchy welts on the skin.' },
        { id: 's109', name: 'Skin lesions', description: 'Abnormal growths or sores on the skin.' },
        { id: 's110', name: 'Moles changing', description: 'Changes in size, shape, or color of moles.' },
        { id: 's111', name: 'Hair loss', description: 'Excessive hair loss or bald patches.' },
        { id: 's112', name: 'Nail changes', description: 'Discoloration, pitting, or other changes to the nails.' },
        
        // Psychological Symptoms
        { id: 's113', name: 'Anxiety', description: 'Excessive worry or fear.' },
        { id: 's114', name: 'Depression', description: 'Persistent sadness and loss of interest.' },
        { id: 's115', name: 'Mood swings', description: 'Rapid and extreme changes in mood.' },
        { id: 's116', name: 'Irritability', description: 'Becoming easily annoyed or angered.' },
        { id: 's117', name: 'Insomnia', description: 'Difficulty falling or staying asleep.' },
        { id: 's118', name: 'Excessive sleepiness', description: 'Feeling very sleepy during the day.' },
        { id: 's119', name: 'Difficulty concentrating', description: 'Trouble focusing or paying attention.' },
        { id: 's120', name: 'Hallucinations', description: 'Seeing, hearing, or feeling things that are not there.' },
        { id: 's121', name: 'Delusions', description: 'False beliefs that are strongly held despite evidence to the contrary.' },
        { id: 's122', name: 'Suicidal thoughts', description: 'Thinking about or planning suicide.' }
    ];

    // Disease database organized by body systems and demographics
    const diseaseDatabase = {
        categories: [
            {
                system: 'Respiratory',
                demographic: 'General',
                diseases: [
                    {
                        id: 'd1',
                        name: 'Asthma',
                        description: 'A condition in which a person\'s airways become inflamed, narrow, and produce extra mucus, which makes it difficult to breathe.',
                        symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing'],
                        severity: 'Moderate to Severe',
                        treatment: 'Inhalers, long-term control medications, and quick-relief medications.'
                    },
                    {
                        id: 'd2',
                        name: 'Pneumonia',
                        description: 'Infection that inflames air sacs in one or both lungs, which may fill with fluid.',
                        symptoms: ['Cough', 'Chest pain', 'Fever', 'Shortness of breath', 'Fatigue'],
                        severity: 'Moderate to Severe',
                        treatment: 'Antibiotics, cough medicine, fever reducers, and pain relievers.'
                    },
                    {
                        id: 'd3',
                        name: 'Tuberculosis',
                        description: 'A potentially serious infectious disease that mainly affects the lungs.',
                        symptoms: ['Persistent cough', 'Weight loss', 'Night sweats', 'Fever', 'Fatigue'],
                        severity: 'Severe',
                        treatment: 'Long-term antibiotic treatment (6-9 months).'
                    }
                ]
            },
            {
                system: 'Digestive',
                demographic: 'General',
                diseases: [
                    {
                        id: 'd4',
                        name: 'Typhoid Fever',
                        description: 'A bacterial infection that can lead to high fever, diarrhea, and vomiting.',
                        symptoms: ['Fever', 'Abdominal pain', 'Diarrhea', 'Headache', 'Weakness'],
                        severity: 'Moderate to Severe',
                        treatment: 'Antibiotics and rehydration.'
                    },
                    {
                        id: 'd5',
                        name: 'Appendicitis',
                        description: 'Inflammation of the appendix, a finger-shaped pouch that projects from your colon on the lower right side of your abdomen.',
                        symptoms: ['Abdominal pain (lower right)', 'Nausea', 'Vomiting', 'Fever', 'Loss of appetite'],
                        severity: 'Severe',
                        treatment: 'Surgical removal of the appendix (appendectomy).'
                    }
                ]
            },
            {
                system: 'Neurological',
                demographic: 'General',
                diseases: [
                    {
                        id: 'd6',
                        name: 'Migraine',
                        description: 'A headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head.',
                        symptoms: ['Throbbing headache', 'Nausea', 'Sensitivity to light', 'Visual disturbances'],
                        severity: 'Moderate to Severe',
                        treatment: 'Pain-relieving and preventive medications, lifestyle changes.'
                    },
                    {
                        id: 'd7',
                        name: 'Stroke',
                        description: 'A medical emergency that occurs when the blood supply to part of the brain is interrupted or reduced.',
                        symptoms: ['Sudden numbness', 'Confusion', 'Trouble speaking', 'Loss of balance', 'Severe headache'],
                        severity: 'Severe',
                        treatment: 'Emergency medical treatment, clot-busting drugs, rehabilitation.'
                    }
                ]
            },
            {
                system: 'Endocrine',
                demographic: 'General',
                diseases: [
                    {
                        id: 'd8',
                        name: 'Diabetes',
                        description: 'A group of diseases that affect how your body uses blood sugar (glucose).',
                        symptoms: ['Frequent urination', 'Increased thirst', 'Fatigue', 'Blurred vision', 'Slow healing wounds'],
                        severity: 'Chronic',
                        treatment: 'Lifestyle changes, blood sugar monitoring, insulin therapy, and oral medications.'
                    },
                    {
                        id: 'd9',
                        name: 'Hyperthyroidism',
                        description: 'A condition in which your thyroid gland produces too much of the hormone thyroxine.',
                        symptoms: ['Weight loss', 'Rapid heartbeat', 'Nervousness', 'Sweating', 'Tremors'],
                        severity: 'Moderate',
                        treatment: 'Anti-thyroid medications, radioactive iodine, beta-blockers, or surgery.'
                    }
                ]
            },
            {
                system: 'Cardiovascular',
                demographic: 'General',
                diseases: [
                    {
                        id: 'd10',
                        name: 'Hypertension',
                        description: 'A common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems.',
                        symptoms: ['Headache', 'Dizziness', 'Blurred vision', 'Nosebleeds', 'Shortness of breath'],
                        severity: 'Moderate to Severe',
                        treatment: 'Lifestyle changes and medications to lower blood pressure.'
                    },
                    {
                        id: 'd11',
                        name: 'Heart Attack',
                        description: 'A medical emergency that occurs when blood flow to the heart is blocked.',
                        symptoms: ['Chest pain', 'Shortness of breath', 'Nausea', 'Cold sweat', 'Fatigue'],
                        severity: 'Severe',
                        treatment: 'Emergency medical treatment, medications, surgery, and lifestyle changes.'
                    }
                ]
            },
            {
                system: 'Reproductive',
                demographic: 'Women\'s Health',
                diseases: [
                    {
                        id: 'd12',
                        name: 'Polycystic Ovary Syndrome (PCOS)',
                        description: 'A hormonal disorder common among women of reproductive age.',
                        symptoms: ['Irregular periods', 'Weight gain', 'Acne', 'Excess hair growth', 'Infertility'],
                        severity: 'Chronic',
                        treatment: 'Lifestyle changes, birth control pills, and diabetes medications.'
                    },
                    {
                        id: 'd13',
                        name: 'Endometriosis',
                        description: 'A painful disorder in which tissue similar to the tissue that normally lines the inside of your uterus grows outside your uterus.',
                        symptoms: ['Pelvic pain', 'Painful periods', 'Pain during intercourse', 'Infertility'],
                        severity: 'Moderate to Severe',
                        treatment: 'Pain medications, hormone therapy, and surgery.'
                    }
                ]
            },
            {
                system: 'Infectious',
                demographic: 'Sexually Transmitted',
                diseases: [
                    {
                        id: 'd14',
                        name: 'Chlamydia',
                        description: 'A common sexually transmitted infection that may not cause symptoms.',
                        symptoms: ['Painful urination', 'Genital discharge', 'Pelvic pain', 'Testicular pain'],
                        severity: 'Mild to Moderate',
                        treatment: 'Antibiotics.'
                    },
                    {
                        id: 'd15',
                        name: 'Gonorrhea',
                        description: 'A sexually transmitted bacterial infection that, if untreated, may cause infertility.',
                        symptoms: ['Burning urination', 'White/yellow discharge', 'Pelvic pain', 'Sore throat'],
                        severity: 'Moderate',
                        treatment: 'Antibiotics.'
                    },
                    {
                        id: 'd16',
                        name: 'Syphilis',
                        description: 'A bacterial infection usually spread by sexual contact that starts as a painless sore.',
                        symptoms: ['Painless sores', 'Skin rash', 'Fever', 'Swollen lymph nodes'],
                        severity: 'Moderate to Severe',
                        treatment: 'Penicillin injection.'
                    },
                    {
                        id: 'd17',
                        name: 'HIV/AIDS',
                        description: 'A chronic, potentially life-threatening condition caused by the human immunodeficiency virus.',
                        symptoms: ['Fever', 'Fatigue', 'Weight loss', 'Recurrent infections', 'Night sweats'],
                        severity: 'Severe',
                        treatment: 'Antiretroviral therapy (ART).'
                    },
                    {
                        id: 'd18',
                        name: 'Genital Herpes',
                        description: 'A common sexually transmitted infection marked by genital pain and sores.',
                        symptoms: ['Painful blisters', 'Itching', 'Flu-like symptoms', 'Sores around genitals'],
                        severity: 'Chronic',
                        treatment: 'Antiviral medications to reduce outbreaks and transmission risk.'
                    },
                    {
                        id: 'd19',
                        name: 'HPV (Human Papillomavirus)',
                        description: 'A viral infection that commonly causes skin or mucous membrane growths (warts).',
                        symptoms: ['Genital warts', 'Itching', 'Abnormal Pap smear', 'No symptoms (often)'],
                        severity: 'Mild to Moderate',
                        treatment: 'No cure, but vaccines can prevent certain types of HPV.'
                    },
                    {
                        id: 'd20',
                        name: 'Trichomoniasis',
                        description: 'A common sexually transmitted infection caused by a parasite.',
                        symptoms: ['Frothy discharge', 'Vaginal odor', 'Itching', 'Pain during urination'],
                        severity: 'Mild to Moderate',
                        treatment: 'Antibiotics.'
                    },
                    {
                        id: 'd21',
                        name: 'Hepatitis B',
                        description: 'A serious liver infection caused by the hepatitis B virus.',
                        symptoms: ['Fatigue', 'Dark urine', 'Jaundice', 'Abdominal pain'],
                        severity: 'Moderate to Severe',
                        treatment: 'Antiviral medications, liver transplant in severe cases.'
                    },
                    {
                        id: 'd22',
                        name: 'Mycoplasma genitalium',
                        description: 'A sexually transmitted infection that can cause urethritis in men and cervicitis in women.',
                        symptoms: ['Urethritis', 'Pelvic pain', 'Discharge', 'Painful urination'],
                        severity: 'Mild to Moderate',
                        treatment: 'Antibiotics.'
                    },
                    {
                        id: 'd23',
                        name: 'Lymphogranuloma Venereum (LGV)',
                        description: 'A sexually transmitted disease caused by certain types of chlamydia bacteria.',
                        symptoms: ['Genital ulcers', 'Swollen lymph nodes', 'Rectal pain', 'Discharge'],
                        severity: 'Moderate to Severe',
                        treatment: 'Antibiotics.'
                    }
                ]
            }
        ]
    };

    // Flatten the diseases for easier searching
    const conditionsDatabase = [];
    diseaseDatabase.categories.forEach(category => {
        category.diseases.forEach(disease => {
            conditionsDatabase.push({
                ...disease,
                system: category.system,
                demographic: category.demographic,
                probability: 'Medium' // Default probability, will be calculated based on symptoms
            });
        });
    });

    // Sample questions for additional information
    const additionalQuestionsData = [
        {
            id: 'q1',
            text: 'How long have you been experiencing these symptoms?',
            type: 'radio',
            options: [
                { value: 'less-than-24h', label: 'Less than 24 hours' },
                { value: '1-3-days', label: '1-3 days' },
                { value: '4-7-days', label: '4-7 days' },
                { value: 'more-than-week', label: 'More than a week' }
            ]
        },
        {
            id: 'q2',
            text: 'How severe are your symptoms?',
            type: 'radio',
            options: [
                { value: 'mild', label: 'Mild (noticeable but not disruptive)' },
                { value: 'moderate', label: 'Moderate (interferes with daily activities)' },
                { value: 'severe', label: 'Severe (makes daily activities very difficult)' }
            ]
        },
        {
            id: 'q3',
            text: 'Have you experienced any of the following? (Select all that apply)',
            type: 'checkbox',
            options: [
                { value: 'fever', label: 'Fever above 38°C (100.4°F)' },
                { value: 'rash', label: 'Rash or skin changes' },
                { value: 'swelling', label: 'Swelling in any part of the body' },
                { value: 'recent-travel', label: 'Recent travel' },
                { value: 'contact-sick', label: 'Contact with someone who is sick' }
            ]
        }
    ];

    // State
    let selectedSymptoms = [];

    // Event Listeners
    function initializeEventListeners() {
        // Get all required elements
        const symptomInput = document.getElementById('symptomInput');
        const addSymptomBtn = document.getElementById('addSymptom');
        const clearBtn = document.getElementById('clearSymptoms');
        const analyzeBtn = document.getElementById('analyzeSymptoms');
        const backToSymptomsBtn = document.getElementById('backToSymptoms');
        
        // Only add event listeners if elements exist
        if (symptomInput) symptomInput.addEventListener('input', handleSymptomInput);
        if (addSymptomBtn) addSymptomBtn.addEventListener('click', addSelectedSymptom);
        if (clearBtn) clearBtn.addEventListener('click', clearAllSymptoms);
        if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeSymptoms);
        if (backToSymptomsBtn) backToSymptomsBtn.addEventListener('click', showSymptomInput);
        
        // Add document-level listeners
        document.addEventListener('click', closeSuggestionsOnOutsideClick);
        
        // Add modal close listeners
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
                document.body.style.overflow = 'auto';
            });
        });
    }
    
    // Initialize event listeners when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEventListeners);
    } else {
        initializeEventListeners();
    }

    // Handle symptom input
    function handleSymptomInput(e) {
        const input = e.target.value.trim().toLowerCase();
        
        if (input.length < 2) {
            symptomSuggestions.style.display = 'none';
            return;
        }
        
        const filtered = symptomDatabase.filter(symptom => 
            symptom.name.toLowerCase().includes(input) && 
            !selectedSymptoms.some(s => s.name === symptom.name)
        );
        
        displaySuggestions(filtered);
    }

    // Display suggestions
    function displaySuggestions(symptoms) {
        if (symptoms.length === 0) {
            symptomSuggestions.innerHTML = '<div class="suggestion-item">No matching symptoms found</div>';
            symptomSuggestions.style.display = 'block';
            return;
        }
        
        symptomSuggestions.innerHTML = symptoms.map(symptom => `
            <div class="symptom-suggestion" data-id="${symptom.id}">
                <div class="suggestion-item">
                    <strong>${symptom.name}</strong>
                    <div class="symptom-description">${symptom.description}</div>
                </div>
            </div>
        `).join('');
        
        symptomSuggestions.style.display = 'block';
        
        // Add click event to suggestions
        document.querySelectorAll('.symptom-suggestion').forEach(item => {
            item.addEventListener('click', () => {
                const symptomId = item.getAttribute('data-id');
                const symptom = symptomDatabase.find(s => s.id === symptomId);
                if (symptom) {
                    addSymptom(symptom);
                    symptomInput.value = '';
                    symptomSuggestions.style.display = 'none';
                }
            });
        });
    }

    // Add symptom
    function addSymptom(symptom) {
        if (selectedSymptoms.some(s => s.id === symptom.id)) return;
        
        selectedSymptoms.push(symptom);
        updateSelectedSymptoms();
        updateAnalyzeButton();
        
        // Show additional questions after first symptom is added
        if (selectedSymptoms.length === 1) {
            showAdditionalQuestions();
        }
    }

    // Add selected symptom from input
    function addSelectedSymptom() {
        const symptomName = symptomInput.value.trim();
        if (!symptomName) return;
        
        // Check if symptom exists in database
        const existingSymptom = symptomDatabase.find(
            s => s.name.toLowerCase() === symptomName.toLowerCase()
        );
        
        if (existingSymptom && !selectedSymptoms.some(s => s.id === existingSymptom.id)) {
            addSymptom(existingSymptom);
        } else if (!existingSymptom) {
            // Add custom symptom
            const newSymptom = {
                id: 'custom-' + Date.now(),
                name: symptomName,
                description: 'Custom symptom added by user.'
            };
            addSymptom(newSymptom);
        }
        
        symptomInput.value = '';
        symptomSuggestions.style.display = 'none';
    }

    // Update selected symptoms list
    function updateSelectedSymptoms() {
        if (selectedSymptoms.length === 0) {
            symptomsList.innerHTML = '<p class="no-symptoms">No symptoms selected yet. Start typing above to add symptoms.</p>';
            return;
        }
        
        symptomsList.innerHTML = selectedSymptoms.map(symptom => `
            <div class="symptom-tag" data-id="${symptom.id}">
                ${symptom.name}
                <span class="remove-tag" data-id="${symptom.id}">&times;</span>
            </div>
        `).join('');
        
        // Add click event to remove buttons
        document.querySelectorAll('.remove-tag').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const symptomId = btn.getAttribute('data-id');
                removeSymptom(symptomId);
            });
        });
        
        // Add click event to symptom tags
        document.querySelectorAll('.symptom-tag').forEach(tag => {
            tag.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-tag')) {
                    const symptomId = tag.getAttribute('data-id');
                    const symptom = selectedSymptoms.find(s => s.id === symptomId);
                    if (symptom) {
                        showSymptomDetails(symptom);
                    }
                }
            });
        });
    }

    // Remove symptom
    function removeSymptom(symptomId) {
        selectedSymptoms = selectedSymptoms.filter(s => s.id !== symptomId);
        updateSelectedSymptoms();
        updateAnalyzeButton();
        
        // Hide additional questions if no symptoms left
        if (selectedSymptoms.length === 0) {
            additionalQuestions.innerHTML = '';
        }
    }

    // Show additional questions
    function showAdditionalQuestions() {
        additionalQuestions.innerHTML = additionalQuestionsData.map(question => `
            <div class="question-card">
                <h4>${question.text}</h4>
                <div class="radio-options" id="${question.id}">
                    ${question.options.map(option => `
                        <label class="radio-option">
                            <input 
                                type="${question.type}" 
                                name="${question.id}" 
                                value="${option.value}">
                            ${option.label}
                        </label>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    // Update analyze button state
    function updateAnalyzeButton() {
        analyzeBtn.disabled = selectedSymptoms.length === 0;
    }

    // Analyze symptoms and redirect to results page
    function analyzeSymptoms() {
        console.log('analyzeSymptoms called with selectedSymptoms:', selectedSymptoms);
        
        if (selectedSymptoms.length === 0) {
            alert('Please add at least one symptom before analyzing.');
            return;
        }
        
        // Show loading state
        const loadingHtml = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3">Analyzing your symptoms...</p>
            </div>
        `;
        
        // In a real app, you might want to show a loading state here
        // before redirecting to the results page
        
        // Encode the selected symptoms for the URL
        const encodedSymptoms = encodeURIComponent(JSON.stringify(selectedSymptoms));
        
        // Redirect to the results page with symptoms as URL parameters
        setTimeout(() => {
            window.location.href = `symptom-results.html?symptoms=${encodedSymptoms}`;
        }, 500);
    }

    // Clear all symptoms
    function clearAllSymptoms() {
        if (selectedSymptoms.length === 0) return;
        
        if (confirm('Are you sure you want to clear all symptoms?')) {
            selectedSymptoms = [];
            updateSelectedSymptoms();
            updateAnalyzeButton();
            additionalQuestions.innerHTML = '';
        }
    }

    // Close suggestions when clicking outside
    function closeSuggestionsOnOutsideClick(e) {
        if (!symptomInput.contains(e.target) && !symptomSuggestions.contains(e.target)) {
            symptomSuggestions.style.display = 'none';
        }
    }

    // Show symptom details in modal
    function showSymptomDetails(symptom) {
        symptomModalTitle.textContent = symptom.name;
        symptomModalBody.innerHTML = `
            <p>${symptom.description}</p>
            <div class="symptom-meta">
                <p><strong>Common conditions:</strong> ${getCommonConditions(symptom.name).slice(0, 3).map(c => c.name).join(', ')}</p>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="document.querySelector('.close-btn').click()">
                    Close
                </button>
            </div>
        `;
        symptomDetailModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Get common conditions for a symptom with fuzzy matching
    function getCommonConditions(symptomName) {
        return conditionsDatabase.filter(condition => 
            condition.symptoms.some(s => 
                s.toLowerCase().includes(symptomName.toLowerCase()) || 
                symptomName.toLowerCase().includes(s.toLowerCase())
            )
        );
    }

    // Function to find conditions by symptoms with match percentage
    function findConditionsBySymptoms(symptoms) {
        console.log('findConditionsBySymptoms called with:', symptoms);
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            console.log('No symptoms provided');
            return [];
        }
        
        const symptomNames = symptoms.map(s => s.name.toLowerCase());
        console.log('Looking for symptoms:', symptomNames);
        
        if (!conditionsDatabase || conditionsDatabase.length === 0) {
            console.error('conditionsDatabase is empty or not properly initialized');
            return [];
        }
        
        return conditionsDatabase.map(condition => {
            if (!condition.symptoms || !Array.isArray(condition.symptoms)) {
                console.log('Condition has no symptoms array:', condition.name);
                return null;
            }
            
            const matchedSymptoms = condition.symptoms.filter(symptom => {
                if (!symptom || typeof symptom !== 'string') return false;
                return symptomNames.some(s => {
                    const symptomLower = symptom.toLowerCase();
                    const sLower = s.toLowerCase();
                    return symptomLower.includes(sLower) || sLower.includes(symptomLower);
                });
            });
            
            const matchPercentage = (matchedSymptoms.length / condition.symptoms.length) * 100;
            
            return {
                ...condition,
                matchedSymptoms,
                matchPercentage,
                probability: matchPercentage > 70 ? 'High' : matchPercentage > 40 ? 'Medium' : 'Low'
            };
        })
        .filter(condition => condition.matchedSymptoms.length > 0)
        .sort((a, b) => b.matchPercentage - a.matchPercentage || b.severity.localeCompare(a.severity));
    }

    // Show analysis results with improved UI
    function showResults() {
        console.log('showResults called');
        
        // Get the results container and conditions list
        const resultsContainer = document.getElementById('resultsContainer');
        const conditionsList = document.getElementById('conditionsList');
        const symptomCheckerCard = document.querySelector('.symptom-checker-card');
        const mainContent = document.querySelector('.main-content');
        
        console.log('Elements found:', {
            resultsContainer: !!resultsContainer,
            conditionsList: !!conditionsList,
            symptomCheckerCard: !!symptomCheckerCard,
            mainContent: !!mainContent
        });
        
        if (!resultsContainer || !conditionsList || !symptomCheckerCard || !mainContent) {
            console.error('Required elements not found:', {
                resultsContainer: !!resultsContainer,
                conditionsList: !!conditionsList,
                symptomCheckerCard: !!symptomCheckerCard,
                mainContent: !!mainContent
            });
            return;
        }
        
        // Ensure the container is visible and properly positioned
        resultsContainer.style.display = 'block';
        resultsContainer.style.visibility = 'visible';
        resultsContainer.style.opacity = '1';
        
        // Make sure the main content is visible
        mainContent.style.display = 'block';
        
        console.log('Selected symptoms:', selectedSymptoms);
        
        // Find matching conditions with symptom matching
        const matchedConditions = findConditionsBySymptoms(selectedSymptoms);
        console.log('Matched conditions:', matchedConditions);
        
        // Clear previous results
        conditionsList.innerHTML = '';
        
        if (!matchedConditions || matchedConditions.length === 0) {
            conditionsList.innerHTML = `
                <div class="alert alert-info">
                    No matching conditions found for the entered symptoms. Please try with different symptoms or consult a healthcare provider.
                </div>
            `;
            document.querySelector('.symptom-checker-card').style.display = 'none';
            resultsContainer.style.display = 'block';
            return;
        }
        
        // Group conditions by body system
        const conditionsBySystem = {};
        matchedConditions.forEach(condition => {
            if (!conditionsBySystem[condition.system]) {
                conditionsBySystem[condition.system] = [];
            }
            conditionsBySystem[condition.system].push(condition);
        });
        
        // Generate HTML for each system and its conditions
        let resultsHTML = '';
        
        for (const [system, conditions] of Object.entries(conditionsBySystem)) {
            resultsHTML += `
                <div class="system-group">
                    <h4 class="system-title">${system}</h4>
                    <div class="conditions-grid">
                        ${conditions.map(condition => `
                            <div class="condition-card">
                                <div class="condition-header">
                                    <h5>${condition.name}</h5>
                                    <span class="badge bg-primary">${Math.round(condition.matchPercentage)}% match</span>
                                </div>
                                <div class="condition-body">
                                    <p class="condition-desc">${condition.description || 'No description available.'}</p>
                                    <div class="severity">
                                        <span class="me-2">Severity:</span>
                                        <span class="badge ${condition.severity === 'Severe' ? 'bg-danger' : 'bg-warning'}">
                                            ${condition.severity}
                                        </span>
                                    </div>
                                    ${condition.treatment ? `
                                        <div class="treatment mt-2">
                                            <strong>Treatment:</strong>
                                            <p class="mb-0">${condition.treatment}</p>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }
        
        // Update the conditions list
        console.log('Updating conditions list with HTML');
        conditionsList.innerHTML = resultsHTML;
        
        // Show the results container and hide the input card
        console.log('Toggling visibility of elements');
        symptomCheckerCard.style.display = 'none';
        resultsContainer.style.display = 'block';
        resultsContainer.style.visibility = 'visible';
        resultsContainer.style.opacity = '1';
        
        // Ensure the container is scrolled into view
        setTimeout(() => {
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Force a reflow to ensure styles are applied
            void resultsContainer.offsetHeight;
        }, 50);
        
        console.log('Element states after update:', {
            symptomCheckerCardDisplay: window.getComputedStyle(symptomCheckerCard).display,
            resultsContainerDisplay: window.getComputedStyle(resultsContainer).display,
            resultsContainerVisibility: window.getComputedStyle(resultsContainer).visibility,
            resultsContainerOpacity: window.getComputedStyle(resultsContainer).opacity
        });
        
        // Show emergency warning if any condition is severe
        const emergencyWarning = document.getElementById('emergencyWarning');
        if (emergencyWarning) {
            const hasSevereCondition = matchedConditions.some(c => c.severity === 'Severe');
            emergencyWarning.style.display = hasSevereCondition ? 'block' : 'none';
        }
        
        // Scroll to results
        resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    // Show symptom input again
    function showSymptomInput() {
        resultsContainer.style.display = 'none';
        document.querySelector('.symptom-checker-card').style.display = 'block';
    }

    // Handle Enter key in symptom input - moved inside initializeEventListeners
    if (symptomInput) {
        symptomInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSelectedSymptom();
            }
        });
    }
});
