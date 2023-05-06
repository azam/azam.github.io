
import { React, ReactDOM } from 'https://unpkg.com/es-react@16.13.1';
import htm from 'https://unpkg.com/htm?module';
import { endpoint } from 'https://cdn.skypack.dev/@octokit/endpoint';

// Thank you https://egghead.io/blog/github-issues-powered-blog

const html = htm.bind(React.createElement);
const TOKEN = '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';

const Posts = (props) => {
    const [issues, setIssues] = React.useState([])
    React.useEffect(() => {
        async function fetchIssues() {
            const { url, ...options } = endpoint('GET /repos/:owner/:repo/issues', {
                owner: 'azam',
                repo: 'azam.github.io',
                auth: TOKEN,
            });
            const response = await fetch(url, options);
            const issues = await response.json();
            setIssues(issues);
        }
        fetchIssues();
    }, []);
    return html`
        ${issues.map(({ number, title, body }) => {
        return html`
                <div id=${number} key=${number}>
                    <h1>${title}</h1>
                    <div>${body}</div>
                </div>
            `;
        })}
    `;
};

ReactDOM.render(html` <${Posts} /> `, document.getElementById('issues'));