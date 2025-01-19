import { marked } from "marked";
import DOMPurify from "dompurify";

export function truncateHTML(htmlString: string, maxChars: number) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const body = doc.body;
    let charCount = 0;
    interface TruncateNode {
        nodeType: number;
        textContent: string | null;
        childNodes: NodeListOf<ChildNode>;
        removeChild: (child: ChildNode) => ChildNode;
        lastChild: ChildNode | null;
    }

    function truncateNode(node: TruncateNode): TruncateNode | null {
        if (charCount >= maxChars) {
            return null;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            const remaining = maxChars - charCount;
            if (node.textContent && node.textContent.length > remaining) {
                node.textContent = node.textContent.slice(0, remaining);
                charCount = maxChars;
            } else {
                charCount += node.textContent?.length || 0;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                const truncatedChild = truncateNode(child as TruncateNode);
                if (!truncatedChild) {
                    while (node.lastChild && node.lastChild !== child) {
                        node.removeChild(node.lastChild);
                    }
                    node.removeChild(child);
                    break;
                }
            }
        }
        return node;
    }

    truncateNode(body);
    return body.innerHTML;
}

export const formatText = async (text: string, char?: number) => {
    marked.setOptions({
        gfm: true,
        breaks: true
    });
    
    const rawHTML = await marked.parse(text);
    const safeHTML = DOMPurify.sanitize(rawHTML);

    if (char === undefined) {
        return safeHTML;
    }
    return truncateHTML(safeHTML, char);
} 