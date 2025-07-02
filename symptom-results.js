document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const symptomsParam = urlParams.get('symptoms');
    
    // Get DOM elements
    const backButton = document.getElementById('backButton');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const emergencyWarning = document.getElementById('emergencyWarning');
    const symptomsList = document.getElementById('symptomsList');
    const resultsSection = document.getElementById('resultsSection');
    const conditionsList = document.getElementById('conditionsList');
    
    // Parse symptoms from URL
    let selectedSymptoms = [];
    if (symptomsParam) {
        try {
            selectedSymptoms = JSON.parse(decodeURIComponent(symptomsParam));
        } catch (e) {
            console.error('Error parsing symptoms:', e);
            showError('Error loading symptom data. Please try again.');
            return;
        }
    }
    
    // Display selected symptoms
    function displaySelectedSymptoms() {
        if (!selectedSymptoms.length) return;
        
        symptomsList.innerHTML = '';
        selectedSymptoms.forEach(symptom => {
            const pill = document.createElement('span');
            pill.className = 'symptom-pill';
            pill.textContent = symptom.name;
            symptomsList.appendChild(pill);
        });
    }
    
    // Show error message
    function showError(message) {
        loadingIndicator.innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                ${message}
            </div>
            <button class="btn btn-primary mt-3" onclick="window.location.href='symptom-checker.html'">
                <i class="fas fa-arrow-left me-2"></i>Back to Symptom Checker
            </button>
        `;
    }
    
    // Navigate back to symptom checker
    function goBack() {
        window.location.href = 'symptom-checker.html';
    }
    
    // Initialize the page
    function init() {
        // Set up event listeners
        backButton.addEventListener('click', goBack);
        
        // Display selected symptoms
        displaySelectedSymptoms();
        
        // Simulate loading (in a real app, this would be an API call)
        if (selectedSymptoms.length > 0) {
            // In a real app, you would make an API call here
            // For now, we'll use a timeout to simulate loading
            setTimeout(() => {
                showResults();
            }, 1000);
        } else {
            showError('No symptoms selected. Please go back and select some symptoms.');
        }
    }
    
    // Show results
    function showResults() {
        // Hide loading indicator
        loadingIndicator.classList.add('d-none');
        
        // Show results section
        resultsSection.classList.remove('d-none');
        
        // In a real app, you would get these from your API
        // For now, we'll use a simplified version of the conditions data
        const matchedConditions = findConditionsBySymptoms(selectedSymptoms);
        
        if (!matchedConditions || matchedConditions.length === 0) {
            conditionsList.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-info">
                        No matching conditions found for the entered symptoms. Please try with different symptoms or consult a healthcare provider.
                    </div>
                </div>
            `;
            return;
        }
        
        // Group conditions by system
        const conditionsBySystem = {};
        matchedConditions.forEach(condition => {
            if (!conditionsBySystem[condition.system]) {
                conditionsBySystem[condition.system] = [];
            }
            conditionsBySystem[condition.system].push(condition);
        });
        
        // Display conditions
        let resultsHTML = '';
        for (const [system, conditions] of Object.entries(conditionsBySystem)) {
            resultsHTML += `
                <div class="system-group">
                    <h4 class="mb-3">${system}</h4>
                    <div class="row g-4">
                        ${conditions.map(condition => `
                            <div class="col-12">
                                <div class="condition-card">
                                    <div class="condition-header">
                                        <h3>${condition.name}</h3>
                                        <span class="badge bg-primary match-badge">
                                            ${Math.round(condition.matchPercentage)}% match
                                        </span>
                                    </div>
                                    <div class="condition-body">
                                        <p class="text-muted">${condition.description || 'No description available.'}</p>
                                        
                                        <div class="d-flex align-items-center mb-3">
                                            <span class="me-2 fw-medium">Severity:</span>
                                            <span class="badge ${condition.severity === 'Severe' ? 'bg-danger' : 'bg-warning'} severity-badge">
                                                ${condition.severity}
                                            </span>
                                        </div>
                                        
                                        ${condition.treatment ? `
                                            <div class="treatment-section">
                                                <h6 class="fw-bold mb-2">Recommended Treatment:</h6>
                                                <p class="mb-0">${condition.treatment}</p>
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        conditionsList.innerHTML = resultsHTML;
        
        // Show emergency warning if any condition is severe
        const hasSevereCondition = matchedConditions.some(condition => condition.severity === 'Severe');
        if (hasSevereCondition) {
            emergencyWarning.classList.remove('d-none');
        }
    }
    
    // Comprehensive disease database with symptom mappings
    const diseaseDatabase = [
        // ===== RESPIRATORY CONDITIONS =====
        {
            name: 'Common Cold',
            description: 'A viral infection of your nose and throat (upper respiratory tract).',
            system: 'Respiratory',
            severity: 'Mild',
            symptoms: ['cough', 'sore throat', 'runny nose', 'sneezing', 'nasal congestion', 'mild headache', 'fatigue', 'slight fever', 'watery eyes', 'mild body aches', 'sneezing', 'stuffy nose', 'malaise'],
            treatment: 'Rest, hydration, and over-the-counter cold medications.'
        },
        {
            name: 'Influenza (Flu)',
            description: 'A viral infection that attacks your respiratory system.',
            system: 'Respiratory',
            severity: 'Moderate to Severe',
            symptoms: ['fever', 'cough', 'sore throat', 'runny nose', 'body aches', 'headache', 'fatigue', 'chills', 'sweating', 'nasal congestion', 'muscle pain', 'weakness', 'loss of appetite'],
            treatment: 'Antiviral medications, rest, and fluids.'
        },
        {
            name: 'Pneumonia',
            description: 'Infection that inflames air sacs in one or both lungs.',
            system: 'Respiratory',
            severity: 'Severe',
            symptoms: ['cough', 'fever', 'chills', 'difficulty breathing', 'chest pain', 'fatigue', 'nausea', 'vomiting', 'shortness of breath', 'sweating', 'rapid breathing', 'loss of appetite', 'confusion (in elderly)'],
            treatment: 'Antibiotics, cough medicine, fever reducers, and pain relievers.'
        },
        {
            name: 'Bronchitis',
            description: 'Inflammation of the bronchial tubes that carry air to your lungs.',
            system: 'Respiratory',
            severity: 'Mild to Moderate',
            symptoms: ['cough', 'mucus production', 'fatigue', 'shortness of breath', 'slight fever', 'chest discomfort', 'wheezing', 'sore throat', 'body aches', 'headache', 'blocked nose'],
            treatment: 'Rest, fluids, cough suppressants, and sometimes bronchodilators.'
        },
        {
            name: 'Sinusitis',
            description: 'Inflammation of the tissue lining the sinuses.',
            system: 'Respiratory',
            severity: 'Mild to Moderate',
            symptoms: ['nasal congestion', 'facial pain', 'headache', 'postnasal drip', 'sore throat', 'cough', 'fatigue', 'bad breath', 'reduced sense of smell', 'ear pressure', 'fever', 'toothache'],
            treatment: 'Nasal decongestants, saline nasal spray, and sometimes antibiotics.'
        },
        
        // ===== GASTROINTESTINAL CONDITIONS =====
        {
            name: 'Gastroenteritis (Stomach Flu)',
            description: 'Inflammation of the stomach and intestines, typically resulting from a viral or bacterial infection.',
            system: 'Gastrointestinal',
            severity: 'Mild to Moderate',
            symptoms: ['diarrhea', 'nausea', 'vomiting', 'abdominal pain', 'fever', 'headache', 'loss of appetite', 'bloating', 'abdominal cramps', 'dehydration', 'muscle aches'],
            treatment: 'Hydration, rest, and over-the-counter medications for symptoms.'
        },
        {
            name: 'Food Poisoning',
            description: 'Illness caused by consuming contaminated food.',
            system: 'Gastrointestinal',
            severity: 'Mild to Severe',
            symptoms: ['nausea', 'vomiting', 'diarrhea', 'abdominal pain', 'fever', 'headache', 'weakness', 'loss of appetite', 'stomach cramps', 'dehydration', 'dizziness', 'sweating'],
            treatment: 'Hydration, rest, and in severe cases, medical attention may be needed.'
        },
        {
            name: 'Irritable Bowel Syndrome (IBS)',
            description: 'A common disorder affecting the large intestine.',
            system: 'Gastrointestinal',
            severity: 'Chronic',
            symptoms: ['abdominal pain', 'bloating', 'gas', 'diarrhea', 'constipation', 'mucus in stool', 'abdominal cramping', 'urgent need to defecate', 'feeling of incomplete bowel movement'],
            treatment: 'Dietary changes, stress management, and medications to control symptoms.'
        },
        {
            name: 'Gastroesophageal Reflux Disease (GERD)',
            description: 'Chronic acid reflux that occurs more than twice a week.',
            system: 'Gastrointestinal',
            severity: 'Chronic',
            symptoms: ['heartburn', 'regurgitation', 'chest pain', 'difficulty swallowing', 'sensation of a lump in the throat', 'chronic cough', 'laryngitis', 'asthma', 'erosion of tooth enamel'],
            treatment: 'Lifestyle changes, antacids, H2 blockers, and proton pump inhibitors.'
        },
        
        // ===== NEUROLOGICAL CONDITIONS =====
        {
            name: 'Migraine',
            description: 'A headache that can cause severe throbbing pain or a pulsing sensation.',
            system: 'Neurological',
            severity: 'Moderate to Severe',
            symptoms: ['severe headache', 'nausea', 'vomiting', 'sensitivity to light', 'sensitivity to sound', 'aura', 'visual disturbances', 'dizziness', 'lightheadedness', 'fatigue', 'neck pain', 'irritability'],
            treatment: 'Pain relievers, triptans, and preventive medications.'
        },
        {
            name: 'Tension Headache',
            description: 'A common headache characterized by mild to moderate pain, often described as feeling like a tight band around the head.',
            system: 'Neurological',
            severity: 'Mild to Moderate',
            symptoms: ['dull headache', 'sensation of tightness around the head', 'tenderness on scalp', 'neck pain', 'shoulder pain', 'sensitivity to light', 'sensitivity to sound', 'difficulty concentrating', 'irritability'],
            treatment: 'Over-the-counter pain relievers, stress management, and relaxation techniques.'
        },
        {
            name: 'Cluster Headache',
            description: 'Recurrent, severe headaches on one side of the head, often around the eye.',
            system: 'Neurological',
            severity: 'Severe',
            symptoms: ['severe pain around one eye', 'tearing', 'redness in the eye', 'stuffy or runny nostril', 'sweating', 'pale skin', 'swelling around the eye', 'drooping eyelid', 'restlessness'],
            treatment: 'Acute treatments (triptans, oxygen therapy) and preventive medications.'
        },
        
        // ===== MUSCULOSKELETAL CONDITIONS =====
        {
            name: 'Muscle Strain',
            description: 'An injury to a muscle or tendon caused by overstretching or overexertion.',
            system: 'Musculoskeletal',
            severity: 'Mild to Moderate',
            symptoms: ['muscle pain', 'muscle stiffness', 'muscle spasms', 'limited range of motion', 'swelling', 'bruising', 'weakness', 'difficulty moving the affected area'],
            treatment: 'Rest, ice, compression, elevation (RICE), and over-the-counter pain relievers.'
        },
        {
            name: 'Osteoarthritis',
            description: 'The most common form of arthritis, affecting millions worldwide.',
            system: 'Musculoskeletal',
            severity: 'Chronic',
            symptoms: ['joint pain', 'joint stiffness', 'tenderness', 'loss of flexibility', 'grating sensation', 'bone spurs', 'swelling', 'pain after overuse', 'morning stiffness'],
            treatment: 'Pain relievers, anti-inflammatory drugs, physical therapy, and in some cases, surgery.'
        },
        {
            name: 'Rheumatoid Arthritis',
            description: 'A chronic inflammatory disorder affecting many joints, including those in the hands and feet.',
            system: 'Musculoskeletal',
            severity: 'Chronic',
            symptoms: ['tender, warm, swollen joints', 'morning stiffness', 'fatigue', 'fever', 'loss of appetite', 'joint deformity', 'loss of function', 'rheumatoid nodules'],
            treatment: 'Disease-modifying antirheumatic drugs (DMARDs), biological response modifiers, and physical therapy.'
        },
        
        // ===== CARDIOVASCULAR CONDITIONS =====
        {
            name: 'Hypertension (High Blood Pressure)',
            description: 'A condition in which the force of the blood against the artery walls is too high.',
            system: 'Cardiovascular',
            severity: 'Chronic',
            symptoms: ['headaches', 'shortness of breath', 'nosebleeds', 'flushing', 'dizziness', 'chest pain', 'visual changes', 'blood in urine'],
            treatment: 'Lifestyle changes and medications such as diuretics, ACE inhibitors, and calcium channel blockers.'
        },
        {
            name: 'Coronary Artery Disease',
            description: 'Damage or disease in the heart\'s major blood vessels.',
            system: 'Cardiovascular',
            severity: 'Severe',
            symptoms: ['chest pain', 'shortness of breath', 'heart attack', 'fatigue', 'heart palpitations', 'dizziness', 'nausea', 'sweating'],
            treatment: 'Lifestyle changes, medications, angioplasty, or bypass surgery.'
        },
        
        // ===== SKIN CONDITIONS =====
        {
            name: 'Eczema (Atopic Dermatitis)',
            description: 'A condition that makes your skin red and itchy.',
            system: 'Dermatological',
            severity: 'Chronic',
            symptoms: ['itchy skin', 'red to brownish-gray patches', 'small, raised bumps', 'thickened skin', 'scaly skin', 'sensitive skin', 'swelling'],
            treatment: 'Moisturizers, corticosteroid creams, and avoiding triggers.'
        },
        {
            name: 'Acne Vulgaris',
            description: 'A skin condition that occurs when hair follicles become plugged with oil and dead skin cells.',
            system: 'Dermatological',
            severity: 'Mild to Moderate',
            symptoms: ['whiteheads', 'blackheads', 'small red bumps', 'pimples', 'large, solid, painful lumps', 'painful, pus-filled lumps under the skin'],
            treatment: 'Topical treatments, oral medications, and lifestyle changes.'
        },
        
        // ===== MENTAL HEALTH CONDITIONS =====
        {
            name: 'Generalized Anxiety Disorder',
            description: 'Excessive anxiety and worry about various events or activities.',
            system: 'Mental Health',
            severity: 'Chronic',
            symptoms: ['persistent worrying', 'restlessness', 'fatigue', 'difficulty concentrating', 'irritability', 'muscle tension', 'sleep disturbances', 'panic attacks'],
            treatment: 'Psychotherapy, medications (antidepressants, anti-anxiety drugs), and lifestyle changes.'
        },
        {
            name: 'Major Depressive Disorder',
            description: 'A mood disorder that causes a persistent feeling of sadness and loss of interest.',
            system: 'Mental Health',
            severity: 'Moderate to Severe',
            symptoms: ['persistent sadness', 'loss of interest in activities', 'changes in appetite', 'sleep disturbances', 'fatigue', 'feelings of worthlessness', 'difficulty concentrating', 'thoughts of death or suicide'],
            treatment: 'Psychotherapy, antidepressant medications, and in severe cases, hospitalization.'
        },

        // ===== INFECTIOUS DISEASES =====
        // Sexually Transmitted Infections
        {
            name: 'HIV/AIDS',
            description: 'A chronic, potentially life-threatening condition caused by the human immunodeficiency virus.',
            system: 'Infectious',
            severity: 'Severe',
            symptoms: ['fever', 'fatigue', 'weight loss', 'recurrent infections', 'night sweats', 'swollen lymph nodes', 'diarrhea', 'oral thrush', 'pneumonia', 'rash', 'chills', 'muscle aches', 'sore throat', 'mouth ulcers'],
            treatment: 'Antiretroviral therapy (ART) to control the virus and prevent transmission.'
        },
        {
            name: 'Chlamydia',
            description: 'A common sexually transmitted infection that may not cause symptoms.',
            system: 'Infectious',
            severity: 'Mild to Moderate',
            symptoms: ['painful urination', 'genital discharge', 'pelvic pain', 'testicular pain', 'vaginal bleeding between periods', 'pain during sex', 'lower abdominal pain'],
            treatment: 'Antibiotics (typically azithromycin or doxycycline). Partners should also be treated.'
        },
        {
            name: 'Gonorrhea',
            description: 'A sexually transmitted bacterial infection that, if untreated, may cause infertility.',
            system: 'Infectious',
            severity: 'Moderate',
            symptoms: ['burning urination', 'white/yellow discharge', 'pelvic pain', 'sore throat', 'painful bowel movements', 'vaginal bleeding between periods', 'swollen testicles'],
            treatment: 'Dual therapy with antibiotics (typically ceftriaxone and azithromycin).'
        },
        {
            name: 'Syphilis',
            description: 'A bacterial infection usually spread by sexual contact.',
            system: 'Infectious',
            severity: 'Moderate to Severe',
            symptoms: ['painless sore (chancre)', 'skin rash', 'fever', 'swollen lymph nodes', 'sore throat', 'headache', 'weight loss', 'muscle aches'],
            treatment: 'Penicillin G injection. Treatment depends on the stage of infection.'
        },
        {
            name: 'Genital Herpes',
            description: 'A common sexually transmitted infection marked by genital pain and sores.',
            system: 'Infectious',
            severity: 'Mild to Moderate',
            symptoms: ['painful blisters', 'itching', 'pain during urination', 'vaginal discharge', 'headache', 'fever', 'swollen lymph nodes'],
            treatment: 'Antiviral medications (acyclovir, valacyclovir, famciclovir) to reduce symptoms and transmission risk.'
        },
        
        // Other Infectious Diseases
        {
            name: 'Urinary Tract Infection (UTI)',
            description: 'Infection in any part of the urinary system, most commonly in the bladder.',
            system: 'Infectious',
            severity: 'Mild to Moderate',
            symptoms: ['strong urge to urinate', 'burning sensation when urinating', 'frequent urination', 'cloudy urine', 'pelvic pain', 'strong-smelling urine', 'blood in urine'],
            treatment: 'Antibiotics. Drinking plenty of water helps flush out bacteria.'
        },
        {
            name: 'Tuberculosis (TB)',
            description: 'A potentially serious infectious disease that mainly affects the lungs.',
            system: 'Infectious',
            severity: 'Severe',
            symptoms: ['cough lasting 3+ weeks', 'coughing up blood', 'chest pain', 'fatigue', 'fever', 'night sweats', 'chills', 'loss of appetite', 'unintentional weight loss'],
            treatment: 'A course of antibiotics for 6-12 months. Directly observed therapy (DOT) is recommended.'
        },
        {
            name: 'Hepatitis B',
            description: 'A serious liver infection caused by the hepatitis B virus.',
            system: 'Infectious',
            severity: 'Moderate to Severe',
            symptoms: ['abdominal pain', 'dark urine', 'fever', 'joint pain', 'loss of appetite', 'nausea and vomiting', 'weakness and fatigue', 'yellowing of skin and eyes (jaundice)'],
            treatment: 'Acute cases may not need treatment. Chronic cases may require antiviral medications or liver transplant in severe cases.'
        },
        {
            name: 'Malaria',
            description: 'A disease caused by a parasite transmitted through the bite of infected mosquitoes.',
            system: 'Infectious',
            severity: 'Severe',
            symptoms: ['fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'diarrhea', 'muscle pain', 'anemia', 'jaundice'],
            treatment: 'Antimalarial medications. Treatment depends on the type of malaria, severity, and drug resistance in the area.'
        }
    ];

    // Helper function to check if two symptom names match
    function symptomsMatch(symptom1, symptom2) {
        // Convert to lowercase and split into words
        const words1 = symptom1.toLowerCase().split(/\s+/);
        const words2 = symptom2.toLowerCase().split(/\s+/);
        
        // Check if any word from first symptom matches any word from second symptom
        return words1.some(word1 => 
            words2.some(word2 => 
                word1.length > 3 && word2.length > 3 && // Only match words longer than 3 characters
                (word1.includes(word2) || word2.includes(word1))
            )
        );
    }

    function findConditionsBySymptoms(selectedSymptoms) {
        console.log('Analyzing symptoms:', selectedSymptoms);
        
        // Extract symptom names to an array for easier matching
        const symptomNames = selectedSymptoms.map(symptom => symptom.name);
        
        // Score each disease based on symptom matches
        const scoredConditions = diseaseDatabase.map(condition => {
            // Convert all condition symptoms to lowercase for case-insensitive matching
            const conditionSymptoms = condition.symptoms.map(s => s.toLowerCase());
            
            // Calculate matching symptoms using our helper function
            const matchingSymptoms = [];
            
            // Check each selected symptom against each condition symptom
            for (const selectedSymptom of symptomNames) {
                const matchedSymptom = conditionSymptoms.find(conditionSymptom => 
                    symptomsMatch(selectedSymptom, conditionSymptom)
                );
                
                if (matchedSymptom && !matchingSymptoms.includes(matchedSymptom)) {
                    matchingSymptoms.push(matchedSymptom);
                }
            }
            
            // If no symptoms match, skip this condition
            if (matchingSymptoms.length === 0) {
                return null;
            }
            
            // Calculate match percentage (weighted by symptom importance)
            const baseMatchPercentage = Math.min(
                100, 
                Math.round((matchingSymptoms.length / conditionSymptoms.length) * 100)
            );
            
            // Increase match percentage if key symptoms are present
            let matchPercentage = baseMatchPercentage;
            
            // Additional scoring based on symptom importance could be added here
            
            return {
                ...condition,
                matchPercentage,
                matchedSymptoms: matchingSymptoms
            };
            
        }).filter(Boolean); // Remove null entries
        
        // Sort by match percentage (highest first)
        scoredConditions.sort((a, b) => {
            // First sort by match percentage
            if (b.matchPercentage !== a.matchPercentage) {
                return b.matchPercentage - a.matchPercentage;
            }
            // If percentages are equal, sort by number of matched symptoms
            return b.matchedSymptoms.length - a.matchedSymptoms.length;
        });
        
        console.log('Matched conditions:', scoredConditions);
        return scoredConditions;
    }
    
    // Start the app
    init();
});
