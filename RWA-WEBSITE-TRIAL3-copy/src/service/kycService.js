

export const KYC_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

const KEY = 'kycStatus';

export function getKycStatus() {
  const v = localStorage.getItem(KEY);
  return v || KYC_STATUS.UNVERIFIED;
}

export function setKycStatus(status) {
  localStorage.setItem(KEY, status);
}

export function clearKycStatus() {
  localStorage.removeItem(KEY);
}
