// Debug Token Structure
// Paste this in browser console after login

function debugToken() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
        console.error('❌ No token found');
        return;
    }
    
    console.log('🔍 Token Debug:');
    console.log('Full token:', token);
    
    try {
        // Decode JWT
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error('❌ Invalid JWT format');
            return;
        }
        
        // Decode header
        const header = JSON.parse(atob(parts[0]));
        console.log('Header:', header);
        
        // Decode payload
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        ));
        console.log('Payload:', payload);
        
        // Check userId
        const userId = payload.userId || payload.sub || payload.id;
        console.log('Extracted userId:', userId);
        
        // Check expiry
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const now = new Date();
            const isExpired = expDate < now;
            console.log('Expires at:', expDate);
            console.log('Is expired:', isExpired);
        }
        
        // Check role
        console.log('Role:', payload.role || 'Not found');
        
        return payload;
    } catch (error) {
        console.error('❌ Failed to decode:', error);
    }
}

// Run it
debugToken();
