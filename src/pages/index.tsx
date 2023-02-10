import { FormEvent, useEffect, useState } from 'react';
import { BiSelectMultiple } from 'react-icons/bi';

import useLocalStorage from '@/hooks/useLocalStorage';

import { ingredients } from '@/data/ingredients';

import Button from '@/components/buttons/Button';
import IconButton from '@/components/buttons/IconButton';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIngredients, setSelectedIngredients] = useLocalStorage<
    Array<string>
  >('input', []);
  const [apiOutput, setApiOutput] = useLocalStorage('apiOutput', '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const callGenerateEndpoint = async (event: FormEvent<HTMLFormElement>) => {
    setIsGenerating(true);
    event.preventDefault();

    console.log('Calling API with input:', selectedIngredients);

    const apiInput =
      'Generate a recipe using some of the following ingredients: ' +
      selectedIngredients.join(', ');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiInput,
        }),
      });

      const data = await response.json();
      console.log(`API Response: ${JSON.stringify(data)}`);
      if (data.output) {
        const { output } = data;
        console.log(`API: ${output.text}`);

        setApiOutput(`${output.text}`);
      } else if (data.error) {
        console.error(`API Error: ${data.error}`);
        alert(
          'Uh oh... something has gone wrong behind the scenes so please try again later.'
        );
      }
    } catch (err) {
      console.error(`An error occurred: ${err}`);
      alert(
        'Uh oh... something has gone wrong behind the scenes so please try again later.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const formatOutput = (output: string) => {
    return output
      .trim()
      .split('\n')
      .map((item, key) => {
        return <p key={key}>{item}</p>;
      });
  };

  const onSelectAll = (title: string) => {
    const ingredientItems =
      ingredients.find((i) => i.title === title)?.items.map((i) => i.name) ??
      [];
    if (ingredientItems.every((i) => selectedIngredients.includes(i))) {
      setSelectedIngredients(
        selectedIngredients.filter(
          (ingredient) =>
            !ingredients
              .find((i) => i.title === title)
              ?.items.map((i) => i.name)
              .includes(ingredient)
        )
      );
    } else {
      setSelectedIngredients([...selectedIngredients, ...ingredientItems]);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target);
    event.target.checked
      ? setSelectedIngredients([...selectedIngredients, event.target.value])
      : setSelectedIngredients(
          selectedIngredients.filter(
            (ingredient) => ingredient !== event.target.value
          )
        );
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-dark'>
          <div className='layout relative flex min-h-screen flex-col items-center space-y-4 py-12 text-white'>
            <h1>Recipe Generator</h1>
            <p className='text-sm text-gray-300'>
              Generate a recipe from a list of ingredients.
            </p>
            <form
              onSubmit={callGenerateEndpoint}
              className='w-full space-y-2 sm:w-2/3 md:w-1/2'
            >
              {ingredients.map(({ title, items }) => {
                return (
                  <section
                    key={title}
                    className='space-y-3 rounded-xl border border-gray-500 p-2'
                  >
                    <div className='flex flex-row justify-between'>
                      <h3>{title}</h3>
                      <div className='space-x-2'>
                        <IconButton
                          icon={BiSelectMultiple}
                          onClick={() => onSelectAll(title)}
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3'>
                      {items.map(({ id, name }) => {
                        return (
                          <div key={id} className='inline-block space-x-2'>
                            <input
                              type='checkbox'
                              id={id}
                              name={name}
                              value={name}
                              checked={selectedIngredients.includes(name)}
                              onChange={onChange}
                            />
                            <label htmlFor={id}>{name}</label>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
              <div className='flex justify-center'>
                <Button
                  className=''
                  isLoading={isGenerating}
                  variant='outline'
                  isDarkBg={true}
                  type='submit'
                >
                  Generate
                </Button>
              </div>
            </form>

            {mounted && apiOutput && (
              <div className='mt-8'>
                <h3>Output</h3>
                <div className='mt-2 text-gray-300'>
                  {formatOutput(apiOutput)}
                </div>
              </div>
            )}

            <footer className='absolute bottom-2 text-gray-200'>
              © {new Date().getFullYear()}
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
