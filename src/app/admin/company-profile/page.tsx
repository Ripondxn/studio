
import { CompanyProfileClient } from './company-profile-client';
import { getCompanyProfile } from './actions';

export default async function CompanyProfilePage() {
    const profile = await getCompanyProfile();
    return (
        <CompanyProfileClient initialProfile={profile} />
    )
}
