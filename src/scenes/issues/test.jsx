useEffect(() => {
    if (currentUser && currentUser.role === "Admin")
    {
      onSnapshot (issuesColRef, (snapshot) => {
        let allIssues = []
  
        snapshot.docs.forEach (issue => {
          allIssues.push ({ ...issue.data(), id: issue.id})
        })
    
        setIssues (allIssues)
    
      })
    }
    
    else if (currentUser && currentUser.role === "Developer")
    {
      const q = query(issuesColRef, where("assignTo", "array-contains", currentUser.full_name))
      console.log (q)
      onSnapshot (issuesColRef, (snapshot) => {
        let allIssues = []

        snapshot.docs.forEach (issue => {
          allIssues.push (issue.data().full_name)
        })

        setIssues (allIssues)
  
      })
    }

  }, [issuesColRef]);