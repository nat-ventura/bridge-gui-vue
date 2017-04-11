const isEmpty = value => value === undefined || value === null || value === '';
const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0];

export function email (value) {
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
}

export function isValidEmail (value) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; // jshint ignore:line
  return regex.test(value);
}

export function required (value) {
  if (isEmpty(value)) {
    return 'Required';
  }
}

export function minLength (min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
  };
}

export function maxLength (max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
}

export function integer (value) {
  if (!Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function oneOf (enumeration) {
  return value => {
    if (!~enumeration.indexOf(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match (field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

export function createValidator (rules) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data);
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}

/**
 * Validates credit card numbers
 * @param {String} ccNumber.error
 * @param {String} ccNumber.value
 * @returns {Object}
 */
export function validateCCNumber (ccNumber) {
  ccNumber.error = '';

  // Validation regexes
  const visa = /^4[0-9]{12}(?:[0-9]{3})?$/.test(ccNumber.value);
  const mastercard = /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/.test(ccNumber.value);
  const amex = /^3[47][0-9]{13}$/.test(ccNumber.value);
  const discover = /^6(?:011|5[0-9]{2})[0-9]{12}$/.test(ccNumber.value);
  const jcb = /^(?:2131|1800|35\d{3})\d{11}$/.test(ccNumber.value);
  const dinersclub = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(ccNumber.value);

  if (!ccNumber.value) {
    return ccNumber;
  }

  if (!visa && !mastercard && !amex && !discover && !jcb && !dinersclub) {
    ccNumber.error = 'Enter a valid credit card number';
  }

  return ccNumber;
}

/**
 * Validates CVV
 * @param {String} cvv.error
 * @param {String} cvv.value
 * @returns {Object}
 */
export function validateCVV (cvv) {
  const cvvIsValid = /^([0-9]{3,4})$/.test(cvv.value);
  cvv.error = '';

  if (!cvv.value) {
    return cvv;
  }

  if (!cvvIsValid) {
    cvv.error = 'Please enter a valid CVV';
  }

  return cvv;
}

/**
 * Validates CC Expiration
 * @param {String} ccExp.error
 * @param {String} ccExp.value
 * @returns {Object}
 */
export function validateCCExp (ccExp) {
  const ccExpIsValidYear = /^((0[1-9])|(1[0-2]))\/((2017)|(20[1-4][0-9]))$/.test(ccExp.value);
  ccExp.error = '';

  if (!ccExp.value) {
    return ccExp;
  }

  if (!ccExpIsValidYear) {
    ccExp.error = 'Please enter a valid expiration date (MM/YYYY)';
  }

  return ccExp;
}

/**
 * Validates if CC form can be submitted
 * @params {Object} fields
 * @returns {Boolean}
 */
export function validateCCForm (fields) {
  const { ccNumber, cvv, ccExp } = fields;

  if (cvv.error || ccExp.error || ccNumber.error || !cvv.value || !ccExp.value || !ccNumber.value) {
    return false;
  }

  return true;
}
