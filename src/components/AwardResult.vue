<template>
	<p>First-time freshmen can use the Scholarship Estimator to see if they qualify for an automatic scholarship based on their GPA and ACT/SAT Score!</p>
	<p>FHSU offers first-time, full-time, on-campus freshman students the opportunity to receive an automatic and renewable scholarship based on a combination of their ACT/SAT score and GPA.&#160;Students may be eligible to receive up to $15,000 in scholarship funds automatically. Yes, we superscore! The actual scholarship award will be based upon your verified official academic credentials. These scholarships are renewable for three additional years, provided normal scholarship eligibility criteria are met.&#160;View a PDF of the&#160; 
		<a title="Scholarship Graph" href="/admissions/documents/scholarship-graph.pdf">Scholarship Graph</a>.
	</p>
	<h4>
		<strong>Deadline: June 30th</strong>
	</h4>
	<p>&#160;</p>
	<br />
    <div class="scholarship-form">
		<h3 class="scholarship-form-header" id="estimator">Scholarship Estimator&#160;</h3>
		<!-- Form for selecting First Year or Transfer Student -->
        <form @submit.prevent="calculateScholarship" method="POST" id="scholarship-form">
			<div class="d-flex justify-content-center">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" name="scholarship_student_type" type="radio" ref="scholarship_firstyearstudent_radio" value="firstYear" v-model="studentType" id="scholarship_firstyearstudent_radio">
                    <label class="form-check-label" for="scholarship_firstyearstudent_radio">First Year Student</label>
                </div>
                <div class="form-check form-check-inline">
                    <input class="form-check-input" name="scholarship_student_type" type="radio" ref="scholarship_transferstudent_radio" value="transfer" v-model="studentType" id="scholarship_transferstudent_radio">
                    <label class="form-check-label" for="scholarship_transferstudent_radio">Transfer Student</label>
                </div>
            </div>
			<!-- Range sliders for ACT/SAT Score and GPA -->
			<div class="form-row leftfix" ref="scholarship_firstyearstudent_div" id="scholarship_firstyearstudent_div">
				<div v-if="studentType === 'firstYear'">
					<div class="col-lg-10">
						<p>To calculate your estimated award amount, enter your score, and non-weighted cumulative GPA. 
							For each option, you can choose your composite score on the ACT or SAT (ERW+M only)</p>
						<h4 class="text-left">ACT/SAT Score: <span>{{ act_score }}</span></h4>
						<label for="actslider"></label>
						<div class="slider-component" id="actslider">
							<div class="slidecontainer">
								<input class="slider" type="range" ref="actslider" min="0" max="36" step="1" v-model="act_score" id="actslider">
							</div>
						</div>
					</div>

					<div class="col-lg-10">
						<h4 class="text-left">First Year GPA: <span>{{ firstyear_gpa_score }}</span></h4>
						<label for="gpaslider"></label>
						<div class="slider-component" id="gpaslider">
							<div class="slidecontainer">
								<input class="slider" type="range" ref="gpaslider" min="0" max="4.0" step="0.5" v-model="firstyear_gpa_score" id="gpaslider">
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
		
		<form @submit.prevent="calculateScholarship" method="POST" id="scholarship-form">
			<div class="form-row leftfix hidden" ref="scholarship_transferstudent_div" id="scholarship_transferstudent_div">
				<div v-if="studentType === 'transfer'">
					<div class="col-lg-10">
						<p>To calculate your estimated award amount, enter your non-weighted cumulative GPA.</p>
						<h4 class="text-left">Transfer GPA: <span>{{ transfer_gpa_score }}</span></h4>
						<label for="gpatransferslider"></label>
						<div class="slider-component" id="gpatransferslider">
							<div class="slidecontainer">
								<input class="slider" type="range" ref="gpatransferslider" min="0" max="4.0" step="0.5" v-model="transfer_gpa_score" id="gpatransferslider">
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
			
			<button @click="calculateScholarship">Calculate Scholarship</button>
			<div v-if="scholarship_value">
				<div class="col-lg-10" id="scholarship_indexlevel">&#160;</div>
				<div class="agree-wrapper hidden" v-if="scholarship_value && !agreedToTerms" id="agree-wrapper">
					<p>
						I understand that the information I am about to preview is an unofficial offer due to self-reported 
						information. This information is true and correct to the best of my knowledge and ability. 
						I understand that Scholarship Services at FHSU will verify all self-reported documentation. 
						I further understand that if I'm reporting my ACT/SAT superscore, I will need to send all 
						standardized test scores for verification of award.
					</p>
					<!-- Terms and Conditions -->
					<div>
						<label class="agree-label" for="agree">
							<input type="checkbox" v-model="agreedToTerms" id="agree"/>
							I agree to the terms and conditions
						</label>
					</div>
					<br>
					<!-- Claim button -->
					<div>
						<button :disabled="!agreedToTerms" @click.prevent="claimScholarship">Claim Scholarship</button>
					</div>
				</div>
				<!-- Confirmation -->
				<div v-if="claimed">
					<p>Congratulations! You have claimed the {{ scholarship_name }} scholarship worth {{ scholarship_value }}.</p>
					<p>You can view more details and accept your scholarship at {{cta_link}}.</p>
				</div>
			</div>
	</div>
</template>

<script>
import $ from 'jquery'
export default {
	mounted() {
		// $ is a reference to jQuery objects
		console.log($)
	},
    data() {
        return {
			studentType: 'firstYear',
            act_score: 0,
			weighted_score: 0,
			firstyear_gpa_score: 0,
			transfer_gpa_score: 0,
			noTestScore: 0,

			index_level: 0,
			scholarship_name: 0,
			scholarship_value: 0,
			scholarship_year_value: 0,
			cta_link: '',

			agreedToTerms: false,
			claimed: false,
		};
    },
    methods: {
		calculateScholarship() {
			// If they choose FIRST YEAR student
			this.$refs.scholarship_firstyearstudent_radio.addEventListener('click', () => {
				this.$refs.scholarship_firstyearstudent_div.classList.remove('hidden');
				this.$refs.scholarship_transferstudent_div.classList.add('hidden');
				this.Update_FirstYearStudent_Score();
			});

			// If they choose TRANSFER student
			this.$refs.scholarship_transferstudent_radio.addEventListener('click', () => {
				this.$refs.scholarship_firstyearstudent_div.classList.remove('hidden');
				this.$refs.scholarship_transferstudent_div.classList.add('hidden');
				this.Update_TransferStudent_Score();
			});

			// If they change the value for ACT score
			this.$refs.actslider.addEventListener('change', () => {
				this.Get_ACT_Score();
				this.Update_FirstYearStudent_Score();
			});

			// If they change the value for FIRST YEAR GPA score
			this.$refs.gpaslider.addEventListener('change', () => {
				this.Get_FirstYearGPA_Score();
				this.Update_FirstYearStudent_Score();
			});

			// If they change the value for TRANSFER GPA score
			this.$refs.gpatransferslider.addEventListener('change', () => {
				this.Get_TransferGPA_Score();
				this.Update_TransferStudent_Score();
			});
		},

		// Gets values from the form for ACT score and validates
		Get_ACT_Score() {
			this.act_score = parseInt(this.$refs.actslider.value);
			// Validate scores and then store the ACT score
			// -1 = They haven't made a selection yet
			if (this.act_score === -1) {
				return 'NO SELECTION YET';
			// 0 = They don't have an ACT score
			} else if (this.act_score === 0) {
				return 'NO ACT SCORE';
			// 1 = Below the minumum range
			} else if (this.act_score === 1) {
				return 'ACT BELOW 16';
			// 16-36 = A usable ACT score	
			} else if (this.act_score >= 16 && this.act_score <= 36) {
				return 'ACT SCORE IS ' + this.act_score;
			// Anything else is an error
			} else {
				return 'ERROR - Invalid ACT Value';
			}
		},

		// Gets values from the form for First Year GPA score and validates
		Get_FirstYearGPA_Score() {
			this.firstyear_gpa_score = parseFloat(this.$refs.gpaslider.value);
		},

		// Gets values from the form for Transfer GPA score and validates
		Get_TransferGPA_Score() {
			this.transfer_gpa_score = parseFloat(this.$refs.gpatransferslider.value);
		},

		// Takes the ACT and FIRST YEAR GPA and runs the ACADEMIC RATING formula
		Update_FirstYearStudent_Score() {
			// one of the numbers are not valid so we return a 0 scholarship
			if (this.act_score == -1 || this.firstyear_gpa_score == -1) {
				this.weighted_score = -1;
			// if the ACT or GPA is too low then we return a 0
			} else if (this.act_score == 1 || this.firstyear_gpa_score == 1) {
				this.weighted_score = 0;
			// the ACT score is valid but they do not have a GPA so we use a partial formula
			} else if ((this.act_score >= 16 && this.act_score <= 36) && this.firstyear_gpa_score == 0) {
				//weighted_score = act_score * 4.166;
				this.weighted_score = this.act_score * 0;
			// they do not have an ACT score but they DO have a valid GPA so we use a partial formula
			} else if (this.act_score == 0 && (this.firstyear_gpa_score >= 2.0 && this.firstyear_gpa_score <= 4.0)) {
				//weighted_score = firstyear_gpa_score * 37.5;
				this.weighted_score = this.firstyear_gpa_score * 0;
			// the ACT score is valid AND the GPA is valid so we use full formula
			} else if ((this.act_score >= 16 && this.act_score <= 36) && (this.firstyear_gpa_score >= 2.0 && this.firstyear_gpa_score <= 4.0)) {
				this.weighted_score = (this.act_score * 2.77778) + (this.firstyear_gpa_score * 25);
			// the ACT score is invalid so we can't run the formula
			} else {
				this.weighted_score = -1;
			}
			//Update_NewStudent_Index_Score(this.weighted_score);
		},
		
		Update_TransferStudent_Score() {
			if (this.transfer_gpa_score < 0) {
				this.scholarship_value = 0;
				$("#scholarship_indexlevel").html("");
			} else if (this.transfer_gpa_score == 0) {
				this.scholarship_value = 0;
				$("#scholarship_indexlevel").html("<p>A GPA is required to qualify for a university scholarship.</p>");
			} else if (this.transfer_gpa_score > 0 && this.transfer_gpa_score < 2.5) {
				this.scholarship_value = 0;
				this.cta_link = '#contact';
				$("#scholarship_indexlevel").html("<p>According to the GPA you entered, you are not eligible for an automatic scholarship, but please check out our <a href=\"#scholarships\">additional scholarship opportunities</a>.  If you have any questions, please donâ€™t hesitate to contact us.</p><p><a href=\"" + this.cta_link + "\" class=\"btn btn-primary btn-sm\">Contact Us</a></p>");
			} else if (this.transfer_gpa_score >= 2.5 && this.transfer_gpa_score < 3) {
				this.scholarship_value = 500;
				this.cta_link = 'transfer-500';
				$("#agree-wrapper").removeClass("hidden");
				$("#contact-admissions").addClass("hidden");
				$("#additional-scholarships").removeClass("hidden");
				$("#scholarship-form").attr("action", "https://www.fhsu.edu/finaid/scholarships/transfer-500");
				/*$("#scholarship_indexlevel").html("<p>Congratulations!  As a transfer student, your GPA makes you eligible for a university scholarship worth <b> $" + scholarship_value + "</b>.<p><input type=\"submit\" value=\"Claim Scholarship \"  class=\"btn btn-primary btn-sm\" onclick=\"validateCheckbox()\"></p>");*/
				$("#scholarship_indexlevel").html("<p>Congratulations!  As a transfer student, your GPA makes you eligible for a university scholarship worth <b> $" + this.scholarship_value + "</b>.</p><p><a href=\"https://www.fhsu.edu/finaid/scholarships/" + this.cta_link + "\" class=\"btn btn-primary btn-sm\">Claim Scholarship</a></p>");
			} else if (this.transfer_gpa_score >= 3 && this.transfer_gpa_score < 3.5) {
				this.scholarship_value = 1000;
				this.cta_link = 'transfer-1000';
				$("#agree-wrapper").removeClass("hidden");
				$("#contact-admissions").addClass("hidden");
				$("#additional-scholarships").removeClass("hidden");
				$("#scholarship-form").attr("action", "https://www.fhsu.edu/finaid/scholarships/transfer-1000");
				/*$("#scholarship_indexlevel").html("<p>Congratulations!  As a transfer student, your GPA makes you eligible for a university scholarship worth <b> $" + scholarship_value + "</b>.<p><input type=\"submit\" value=\"Claim Scholarship \"  class=\"btn btn-primary btn-sm\" onclick=\"validateCheckbox()\"></p>");*/
				$("#scholarship_indexlevel").html("<p>Congratulations!  As a transfer student, your GPA makes you eligible for a university scholarship worth <b> $" + this.scholarship_value + "</b>.</p><p><a href=\"https://www.fhsu.edu/finaid/scholarships/" + this.cta_link + "\" class=\"btn btn-primary btn-sm\">Claim Scholarship</a></p>");
			} else if (this.transfer_gpa_score >= 3.5) {
				this.scholarship_value = 1500;
				this.cta_link = 'transfer-1500';
				$("#agree-wrapper").removeClass("hidden");
				$("#contact-admissions").addClass("hidden");
				$("#additional-scholarships").removeClass("hidden");
				$("#scholarship-form").attr("action", "https://www.fhsu.edu/finaid/scholarships/transfer-1500");
				/*$("#scholarship_indexlevel").html("<p>Congratulations!  As a transfer student, your GPA makes you eligible for a university scholarship worth <b> $" + scholarship_value + "</b>.<p><input type=\"submit\" value=\"Claim Scholarship \"  class=\"btn btn-primary btn-sm\" onclick=\"validateCheckbox()\"></p>");*/
				$("#scholarship_indexlevel").html("<p>Congratulations!  As a transfer student, your GPA makes you eligible for a university scholarship worth <b> $" + this.scholarship_value + "</b>.</p><p><a href=\"https://www.fhsu.edu/finaid/scholarships/" + this.cta_link + "\" class=\"btn btn-primary btn-sm\">Claim Scholarship</a></p>");
			} else {
				this.scholarship_value = 0;
				$("#scholarship_indexlevel").html("");
			}
			// write the result to the screen
			$("#scholarshipsubtotal").text(this.scholarship_value.toLocaleString());
			if (this.scholarship_value == 0) {
				$("#forScholarship").css("color", "red");
				//Math.abs(Number($('#scholarshipsubtotal').val()));    
			} else {
				$("#forScholarship").css("color", "#F6AF32");
			}
		},

		Update_NewStudent_Index_Score(academic_rating) {
			if (academic_rating >= 173) {
				this.index_level = 1;
				this.scholarship_name = "Tiger Pride Scholarship";
				this.scholarship_value = 15000;
				this.scholarship_year_value = 3750;
				this.cta_link = 'tiger-pride-scholarship';
				$("#agree-wrapper").removeClass("hidden");
				$("#contact-admissions").addClass("hidden");
				$("#additional-scholarships").removeClass("hidden");
				$("#scholarship-form").attr("action", "https://www.fhsu.edu/finaid/scholarships/tiger-pride-scholarship" + "?act_sat_score=" + this.act_score + "&cumulative_high_school_gpa=" + this.firstyear_gpa_score);
			} else if (academic_rating >= 163 && this.academic_rating < 173) {
				this.scholarship_value = 11000;
				this.scholarship_year_value = 2750;
				this.scholarship_name = "Victor E. Scholarship";
				this.cta_link = "victor-e-scholarship";
				$("#agree-wrapper").removeClass("hidden");
				$("#contact-admissions").addClass("hidden");
				$("#additional-scholarships").removeClass("hidden");
				$("#scholarship-form").attr("action", "https://www.fhsu.edu/finaid/scholarships/victor-e-scholarship" + "?act_sat_score=" + this.act_score + "&cumulative_high_school_gpa=" + this.firstyear_gpa_score);
			} else if (academic_rating >= 153 && this.academic_rating < 163) {
				this.index_level = 3;
				this.scholarship_value = 8000;
				this.scholarship_year_value = 2000;
				this.scholarship_name = "Black & Gold Scholarship";
				this.cta_link = "black-gold-scholarship";
			} else if ((academic_rating >= 142 && this.academic_rating < 153) && (this.noTestScore.value != 0)) {
				this.index_level = 4;
				this.scholarship_name = "Hays City Scholarship";
				this.scholarship_value = 6000;
				this.scholarship_year_value = 1500;
				this.cta_link = "hays-city-scholarship";
				$("#agree-wrapper").removeClass("hidden");
				$("#contact-admissions").addClass("hidden");
				$("#additional-scholarships").removeClass("hidden");
				$("#scholarship-form").attr("action", "https://www.fhsu.edu/finaid/scholarships/hays-city-scholarship" + "?act_sat_score=" + this.act_score + "&cumulative_high_school_gpa=" + this.firstyear_gpa_score);
			}
			else if (academic_rating >= 0 && this.academic_rating < 142) {
				this.index_level = 5;
				this.scholarship_value = 0;
				this.cta_link = "admissions-staff";
				$("#agree-wrapper").addClass("hidden");
				$("#contact-admissions").removeClass("hidden");
				$("#additional-scholarships").addClass("hidden");
			} else {
				this.index_level = -1;
				this.scholarship_value = 0;
				$("#agree-wrapper").addClass("hidden");
				$("#additional-scholarships").addClass("hidden");
			}
			// level 4 receives a scholarship
			if (this.index_level == 1) {
				$("#scholarship_indexlevel").html("<div v-if=\"scholarshipGiven\"><h3>Congratulations!</h3><div class=\"row row-cols-1 row-cols-md-3 mb-3 text-center\"> <div class=\"col\"> <div class=\"card mb-4 rounded-3 shadow-sm\"> <div class=\"card-header py-3\"> <h4 class=\"my-0 fw-normal\">" + this.scholarship_name + "</h4></div> <div class=\"card-body\"> <h1 class=\"card-title pricing-card-title\">$" + this.scholarship_value + "</h1> <ul class=\"list-unstyled mt-3 mb-4\"> <li>$" + this.scholarship_year_value + " First Year <li>Renewable For Three Years</ul> <button type=\"submit\" value=\"Claim Scholarship\" class=\"w-40 btn btn-lg btn-primary\" onclick=\"validateCheckbox()\">Claim Scholarship</button></div>");
				$("#additional-scholarships").html("<p><em>*All first-time, full-time, on-campus Freshman ACT/SAT Scholarships are renewable for three additional years if at least a 3.3 FHSU cumulative GPA is maintained. FHSU must receive your test scores by June 30, 2022  to be eligible.</em></p>")
			// levels 1-3 receive a scholarship
			} else if (this.index_level >= 2 && this.index_level <= 4) {
				$("#scholarship_indexlevel").html("<div v-if=\"scholarshipGiven\"><h3>Congratulations!</h3><div class=\"row row-cols-1 row-cols-md-3 mb-3 text-center\"> <div class=\"col\"> <div class=\"card mb-4 rounded-3 shadow-sm\"> <div class=\"card-header py-3\"> <h4 class=\"my-0 fw-normal\">" + this.scholarship_name + "</h4></div> <div class=\"card-body\"> <h1 class=\"card-title pricing-card-title\">$" + this.scholarship_value + "</h1> <ul class=\"list-unstyled mt-3 mb-4\"> <li>$" + this.scholarship_year_value + " First Year <li>Renewable For Three Years</ul> <button type=\"submit\" value=\"Claim Scholarship\" class=\"w-40 btn btn-lg btn-primary\" onclick=\"validateCheckbox()\">Claim Scholarship</button></div>");
				$("#additional-scholarships").html("<p><em>*All first-time, full-time, on-campus Freshman ACT/SAT Scholarships are renewable for three additional years if at least a 3.3 FHSU cumulative GPA is maintained. FHSU must receive your test scores by June 30, 2022  to be eligible.</em></p>")
			// any other level does not recieve a scholarship
			} else if (this.index_level > 4) {
				$("#scholarship_indexlevel").html("<div v-if=\"scholarshipGiven\"><p>According to the scores you entered, you don't currently qualify for an automatic freshman scholarship, If you have any questions, please fill out the form below and our admissions staff will be happy to visit with you about other potential scholarship opportunities.</p></div>");
				$("#additional-scholarships").html("<p><em>*All first-time, full-time, on-campus Freshman ACT/SAT Scholarships are renewable for three additional years if at least a 3.3 FHSU cumulative GPA is maintained. FHSU must receive your test scores by June 30, 2022  to be eligible.</em></p>")
			// an invalid index level means clear the message
			} else {
				$("#scholarship_indexlevel").html("");
			}
			// write the result to the screen
			$("#scholarshipsubtotal").text(this.scholarship_value.toLocaleString());
			if (this.scholarship_value == 0) {
				$("#forScholarship").css("color", "red");
				//Math.abs(Number($('#scholarshipsubtotal').val()));    
			} else {
				$("#forScholarship").css("color", "#F6AF32");
			}
		},
    },
};
</script>

<style scoped>
.slider-component .slidecontainer .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    border-radius: 2px;
    background: #fbf0cd;
    outline: none;
    opacity: 1;
    -webkit-transition: 0.2s;
    transition: 0.2s;
}

.slider-component .slidecontainer .slider:hover {
    opacity: 1;
}

.slider-component .slidecontainer .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    background: #fcb817;
    cursor: pointer;
    border-radius: 50%;
}

#actslider,
#gpaslider,
#gpatransferslider {
    -webkit-appearance: none;
    appearance: none;
    height: 10px;
    outline: none;
    border-radius: 4px;
}

#actslider::-webkit-slider-thumb,
#gpaslider::-webkit-slider-thumb,
#gpatransferslider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    cursor: pointer;
    z-index: 3;
    position: relative;
}

.scholarships-card {
        display: none;
    }

    .scholarships-card {
        border: 1px solid #d1d1d1;
        float: left;
        width: 48%;
        height: 200px;
        padding: 20px;
        text-transform: uppercase;
        font-weight: bold;
        text-align: center;
        margin: 5px;
        border-radius: 3px;
    }


    em:before {
        content: "";
        display: block;
        margin-top: 40px;
    }

    .scholarship-form {
        border: 1px solid #c1c1c1;
        padding: 15px;
        border-radius: 4px;
    }

    .scholarship-form em {
        font-size: .9rem;
        }
        .scholarship-form
        input[type="text"] {
            width: 100px;
            float: left;
        }

    label {
        float: left;
        padding: 0 5px
    }

        label[for="gpa"] {
            padding-left: 25px;
        }

    .hidden {
        display: none;
    }

    .i-am-radio {
        padding-right: 30px;
        font-weight: bold;
        margin: 8px 0 0 7px;
    }

    .form-label {
        font-weight: bold;
        margin-left: -5px;
    }

    .form-row:after {
        content: "";
        padding: 15px;
        margin: 15px;
    }

    .help-text {
        font-size: 13px;
        float: right;
        margin-top: -12px;
    }

    #scholarship_indexlevel {
        text-align: center;
        margin-top: 40px;
    }

    .form-row, .col-lg-10 {
        margin: 0 !important;
        display: inline;
    
    }

    .scholarship-form h3 {
        font-size: 1.6rem;
        background: #fff;
        text-align: center;
    }

    #scholarship_firstyearstudent_div {
        padding-top: 20px;
    }

	#scholarship_transferstudent_div {
        padding-top: 20px;
    }


.additional-scholarships{
margin-left: 30px;
}

#scholarship_indexlevel{
padding-bottom: 50px;
padding-top: 40px;
display: block;
margin: 40px auto 0 auto !important;;
}

#scholarship_indexlevel h3{
width: 100%;
}

.additional-scholarships-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.additional-scholarships-column {
  flex-grow: 1;
  flex-basis: 50%;  
  padding: 5px;
  float: left;
}
.agree-wrapper{
margin-left: auto;
margin-right: auto;
font-size: 12px;
max-width: 82%;
padding: 15px 10px 5px 10px;
}


label[for="agree"]{
font-size: 14px;
margin: 0 0 0 200px;
margin-top: -5px;
font-weight: bold;
}

#contact-admissions h3{
width: 100%;
}
#agree-wrapper{
background: #e1e1e1;
margin-top: -20px;
border-radius: 4px;
}

.additional-scholarships em{
font-size: 12.5px !important;
}

.scholarship-form-header{
margin-left: auto;
margin-right: auto;
width: 65%;
}
/*.agree-wrapper p.agree-label label{
margin-left: auto !important;
margin-right: auto !important;
}*/

.custom-select{
background: none;
}
/*.additional-scholarships-row h2{
    font-size: 1rem;
}*/

</style>