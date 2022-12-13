

describe('Blog app', function () {
  const user = {
    name: 'user one',
    username: 'userreal',
    password: 'realpassword'
  }

  const user2 = {
    name: 'user two',
    username: 'userreal2',
    password: 'realpassword2'
  }

  const frontendUrl = 'http://localhost:3000'
  const backendUrl = 'http://localhost:3003'


  beforeEach(function () {
    cy.request('POST', `${backendUrl}/api/testing/reset`)
    cy.request('POST', `${backendUrl}/api/users/`, user)
    cy.visit(frontendUrl)

  })

  it('Login form is shown on startup', function () {
    cy.contains('Login to the application')
    cy.get('label[for="username-input"]').contains('username');
    cy.get('#username-input').should('exist')
    cy.get('label[for="password-input"]').contains('password')
    cy.get('#password-input').should('exist')
    cy.get('form button').contains('login')
  })

  describe('login', function () {
    it('Succeeds with correct credentials', function () {
      cy.get('#username-input').type(user.username)
      cy.get('#password-input').type(user.password)
      cy.get('form button').click()
      cy.contains(`${user.username} has logged in`)
    })

    it('fails with incorrect credentials', function () {
      cy.get('#username-input').type('fakeuserfailure')
      cy.get('#password-input').type('fakepasspordfailure')
      cy.get('form button').click()
      cy.get('#notification').contains('invalid username or password')
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)')
      cy.contains(`${user.username} has logged in`).should('not.exist')
    })
  })

  describe('When logged in', function () {
    const expectedBlog = {
      author: 'van halen',
      title: 'jammin',
      url: 'halen.com'
    }
    beforeEach(function () {
      cy.request('POST', `${backendUrl}/api/login`, { username: user.username, password: user.password })
        .then(response => {
          localStorage.setItem('currentBlogUser', JSON.stringify(response.body))
        })
      cy.visit(frontendUrl)
    })

    it('A blog can be created', function () {
      cy.get('#create-blog-btn').click()
      cy.get('#title-input').type(expectedBlog.title)
      cy.get('#author-input').type(expectedBlog.author)
      cy.get('#url-input').type(expectedBlog.url)
      cy.get('#submit-blog-btn').click()
      cy.get('[data-cy="blog-data-indiv"]').contains(`${expectedBlog.title} ${expectedBlog.author}`)
      cy.get('[data-cy="view-more-btn"]').click()
      cy.get('[data-cy="blog-metadata-div"] > ul > :nth-child(1)').contains(expectedBlog.url)
      cy.get('[data-cy="blog-metadata-div"] > ul > :nth-child(2)').contains('likes 0')
      cy.get('[data-cy="blog-metadata-div"] > ul > :nth-child(3)').contains(user.username)
    })

    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({ author: 'testauthor', title: 'testtitle', url: 'testurl' })
        cy.visit(frontendUrl)
      })

      it('the like button increases the score', function () {
        cy.get('[data-cy="view-more-btn"]').click()
        cy.get('[data-cy="like-more-btn"]').click()
        cy.contains('likes 1')
        cy.get('[data-cy="like-more-btn"]').click()
        cy.contains('likes 2')
        cy.get('[data-cy="like-more-btn"]').click()
        cy.contains('likes 3')

      })

      it('only user that created the blog can delete it', function () {
        cy.request('POST', `${backendUrl}/api/users/`, user2)
        cy.login({ username: user2.username, password: user2.password })
        cy.visit(frontendUrl)
        cy.get('[data-cy="view-more-btn"]').click()
        cy.get('[data-cy="delete-blog-btn"]').click()
        cy.contains('User permissions are invalid')

        cy.login({ username: user.username, password: user.password })
        cy.visit(frontendUrl)
        cy.get('[data-cy="view-more-btn"]').click()
        cy.get('[data-cy="delete-blog-btn"]').click()
        cy.contains('testtitle testauthor').should('not.exist')
      })
    })

    describe('multiple blogs exist', function () {
      const blog1 = { author: 'testauthor1', title: 'testtitle1', url: 'testurl1', likes: 2 }
      const blog2 = { author: 'testauthor2', title: 'testtitle2', url: 'testurl2', likes: 4 }
      const blog3 = { author: 'testauthor3', title: 'testtitle3', url: 'testurl3', likes: 3 }

      beforeEach(function () {
        cy.createBlog(blog1)
        cy.createBlog(blog2)
        cy.createBlog(blog3)
        cy.visit(frontendUrl)
      })

      describe('blogs are sorted by likes in descending order', function () {
        const getNumberOfLikes = (html) => parseInt(html.outerText.match(/[0-9]+/g))
        const checkArraySortedDesc = (x, i ,arr) => i === 0 || x <= arr[i - 1]

        it('initial blogs are sorted by likes in descending order', function() {
          cy.get('[data-cy=blogs-grp] > :nth-child(1) [data-cy=view-more-btn]').click()
          cy.get('[data-cy=blogs-grp] > :nth-child(2) [data-cy=view-more-btn]').click()
          cy.get('[data-cy=blogs-grp] > :nth-child(3) [data-cy=view-more-btn]').click()

          cy.get('[data-cy=blogs-grp] > :nth-child(1)').contains(blog2.author)
          cy.get('[data-cy=blogs-grp] > :nth-child(2)').contains(blog3.author)
          cy.get('[data-cy=blogs-grp] > :nth-child(3)').contains(blog1.author)

          cy.get('[data-cy=blogs-grp] ul > :nth-child(2)').then($elements => {
            const initialLikesSorted = $elements
              .map((i, element) => getNumberOfLikes(element))
              .toArray()
              .every((x, i, arr) => checkArraySortedDesc(x, i, arr))
            expect(initialLikesSorted).to.be.true
          })
        })

        it('blogs are sorted by likes after likes button is clicked', function() {
          cy.get('[data-cy=blogs-grp] > :nth-child(1) [data-cy=view-more-btn]').click()
          cy.get('[data-cy=blogs-grp] > :nth-child(2) [data-cy=view-more-btn]').click()
          cy.get('[data-cy=blogs-grp] > :nth-child(3) [data-cy=view-more-btn]').click()

          cy.get('[data-cy=blogs-grp]').contains(blog1.author).within(() => {
            cy.get('[data-cy=like-more-btn]').click()
            cy.wait(500)
            cy.get('[data-cy=like-more-btn]').click()
            cy.wait(500)
            cy.get('[data-cy=like-more-btn]').click()
          }).then(() => {
            cy.wait(500)
            cy.get('[data-cy=blogs-grp] > :nth-child(1)').contains(blog1.author)
            cy.get('[data-cy=blogs-grp] > :nth-child(2)').contains(blog2.author)
            cy.get('[data-cy=blogs-grp] > :nth-child(3)').contains(blog3.author)

            cy.get('[data-cy=blogs-grp] ul > :nth-child(2)').then($elements => {
              const initialLikesSorted = $elements
                .map((i, element) => getNumberOfLikes(element))
                .toArray()
                .every((x, i, arr) => checkArraySortedDesc(x, i, arr))
              expect(initialLikesSorted).to.be.true
            })
          })
        })
      })
    })
  })
})