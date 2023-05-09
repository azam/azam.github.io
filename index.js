import { React, ReactDOM } from 'https://unpkg.com/es-react@16.13.1';
import htm from 'https://unpkg.com/htm?module';
import { endpoint } from 'https://cdn.skypack.dev/@octokit/endpoint';
import { marked } from 'https://unpkg.com/marked/lib/marked.esm.js';
import purify from 'https://unpkg.com/dompurify/dist/purify.es.js';
// Thank you https://egghead.io/blog/github-issues-powered-blog

const html = htm.bind(React.createElement);
const OWNER = 'azam';
const REPO = 'azam.github.io';

const Posts = (props) => {
    const [issues, setIssues] = React.useState([]);

    React.useEffect(() => {
        async function fetchIssues() {
            const { url, ...options } = endpoint({
                method: 'GET',
                url: `/repos/${OWNER}/${REPO}/issues`,
                creator: OWNER,
                state: 'all',
                labels: 'publish',
            });
            try {
                const response = await fetch(url, options);
                const issues = await response.json();
                // const issues = [{ number: 2, title: 'title', body: 'foobar\n* one\n* two' }]
                if (Array.isArray(issues)) {
                    issues.forEach((issue) => {
                        issue.parsed = { __html: purify.sanitize(marked.parse(issue.body)) };
                    });
                    setIssues(issues);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchIssues();
    }, []);

    return html`
        ${issues.map(({ created_at, updated_at, closed_at, labels, html_url, number, title, parsed, body }) => {
        return html`
            <article class="message">
                <div class="message-header">
                    <span>${title}</span>
                    <a href="${html_url}">#${number}</a>
                </div>
                <div class="message-body" dangerouslySetInnerHTML=${parsed}></div>
            </article>
        `;
    })}
    `;
};

ReactDOM.render(html` <${Posts} /> `, document.getElementById('issues'));