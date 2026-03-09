package com.pryme.loan.service;

import com.pryme.loan.dto.EligibilityRequest;
import com.pryme.loan.dto.EligibilityResponse;
import com.pryme.loan.dto.PrePaymentRequest;
import com.pryme.loan.dto.PrePaymentResponse;

public interface LoanSimulationService {

    public EligibilityResponse checkEligibility(EligibilityRequest request);
    PrePaymentResponse calculatePrePaymentSavings(PrePaymentRequest request);






}

