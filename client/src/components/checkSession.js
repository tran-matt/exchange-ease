const checkSession = async () => {

    try {
      const response = await fetch('/api/check_session',{
        credentials: 'include',     
        method: 'GET',
      });
      if (response.ok) {
        const data = await response.json();
        
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  export default checkSession;
  